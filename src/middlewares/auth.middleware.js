// src/middlewares/auth.middleware.js

import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {

  console.log("middleawre ar req", req.header , req.cookies, req.body );


  try {

    const token = 
      req.cookies?.accessToken ||
      // req.body.refreshToken||
      req.header("Authorization")?.replace("Bearer ", "");

      console.log("middlware token:", token);
      
      
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    // const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);


    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // console.log("User found:", user);
    

    if (!user) {
      throw new ApiError(401, "Invalid Acess Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid acess token");
  }
});

export default verifyJWT;


//-------------------------------------------------------------------------

// import { asyncHandler } from "../utils/AsyncHandler.js";
// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import jwt from "jsonwebtoken";

// const verifyJWT = asyncHandler(async (req, res, next) => {
//   console.log("Middleware at req", req.header, req.cookies, req.body);

//   // First, try to get the access token from cookies or Authorization header
//   const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     // If no token is found, return unauthorized error
//     throw new ApiError(401, "Unauthorized request, token missing");
//   }

//   try {
//     // Try verifying the access token using the ACCESS_TOKEN_SECRET
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     // Find the user based on decoded _id
//     const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
//     console.log("User found:", user);

//     if (!user) {
//       throw new ApiError(401, "Invalid access token");
//     }

//     // Attach user info to the request object for further use
//     req.user = user;
//     return next(); // Token is valid, move to next middleware/route

//   } catch (error) {
//     // If access token verification fails, check if it's expired and refreshable
//     if (error.name === "TokenExpiredError") {
//       // Attempt to refresh token using refresh token
//       const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

//       if (!refreshToken) {
//         throw new ApiError(401, "Refresh token missing");
//       }

//       try {
//         const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//         const user = await User.findById(decodedRefreshToken?._id).select("-password");
//         if (!user) {
//           throw new ApiError(401, "Invalid refresh token");
//         }

//         // Generate a new access token for the user
//         const newAccessToken = jwt.sign(
//           { _id: user._id },
//           process.env.ACCESS_TOKEN_SECRET,
//           { expiresIn: "1h" } // You can adjust the expiry time for access token
//         );

//         // Attach the new access token to the response
//         res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true });

//         // Attach the user to the request object and move to the next middleware
//         req.user = user;
//         return next();

//       } catch (refreshError) {
//         // If refresh token is also invalid, return unauthorized
//         throw new ApiError(401, "Invalid refresh token");
//       }
//     } else {
//       // If it's some other error (e.g., invalid access token), throw error
//       throw new ApiError(401, error?.message || "Invalid access token");
//     }
//   }
// });

// export default verifyJWT;
