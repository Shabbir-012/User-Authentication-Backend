//  src/controllers/user.controller.js

import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//generate the access and refresh token

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); // fetch user from db
    const accessToken = user.generateAccessToken(); //  generate the accesstoken
    const refreshToken = user.generateRefreshToken(); //  generate the refresh token

    // console.log("Generated Refresh Token:", refreshToken); // Check token generation

    user.refreshToken = refreshToken; // assign the refresh token to the user object

    // console.log("User before saving:", user); // Check user object before save

    await user.save({ validateBeforeSave: false }); // save user with new refresh token

    // console.log("User after saving:", user); // Check if token is saved

    return { accessToken, refreshToken };
  } catch (error) {
    // console.error("Error in generateAccessAndRefreshToken:", error);

    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// register the new user
const registerUser = asyncHandler(async (req, res) => {
  // de structure username email pass from req body
  const { username, email, password, role } = req.body;

  // validate the input field

  if ([username, email, password, role].some((field) => field?.trim === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // check if the user already existed or not
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already existed");
  }

  // avatar image upload locally
  // const avatarLocalPath = req.files?.avatar[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // avatar image upload cloudiary from local
  // const avatar = await uploadOnCloudinary(avatarLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // create the user in db
  const user = await User.create({
    username: username,
    email,
    password,
    // avatar: avatar.url,
    role,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Retrieve user from database to verify refreshToken
  // const updatedUser = await User.findById(user._id);
  // console.log("Updated User from DB:", updatedUser); // Check if refreshToken is saved

  // creates a new user and retrieves their details without exposing sensitive information such as passwords and refresh tokens.
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

//log in user

const loginUser = asyncHandler(async (req, res) => {

  // console.log("login request:", req.body);
  
  const { username, email, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "email or username required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password); // user model ar methods create koresilam --> isPasswordCorrect

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credential");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //cookie send korar jnno options send korte hoy
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// log out user

// log out user

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});


//--------------------------------------------------


// const logoutUser = asyncHandler(async (req, res) => {

//   console.log("Logout request:", req.body);
  
//   // const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

//   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header("Authorization")?.replace("Bearer ", "");


//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "Refresh token is required");
//   }

//   try {
//     // Verify and decode the refresh token
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     // Find the user by the decoded token's ID
//     const user = await User.findById(decodedToken._id);

//     if (!user) {
//       throw new ApiError(401, "User not found");
//     }

//     // Check if the provided token matches the stored hashed token
//     const isValid = await user.isRefreshTokenValid(incomingRefreshToken);

//     if (!isValid) {
//       throw new ApiError(401, "Invalid refresh token");
//     }

//     // Clear the refresh token in the database
//     user.refreshToken = undefined;
//     await user.save();

//     // Clear cookies
//     const options = {
//       httpOnly: true,
//       // secure: process.env.NODE_ENV === "production", // Set secure only in production
//       secure: true
    
//     };

//     return res
//       .status(200)
//       .clearCookie("accessToken", options)
//       .clearCookie("refreshToken", options)
//       .json(new ApiResponse(200, {}, "User logged out successfully"));
//   } catch (error) {
//     throw new ApiError(401, error.message || "Invalid refresh token");
//   }
// });




// refresh access token

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
