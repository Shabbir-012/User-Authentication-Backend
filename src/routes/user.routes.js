import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

import verifyRole from "../middlewares/role.middleware.js"

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured login

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

// userbase router

router.use(verifyJWT, verifyRole("manager" , "admin")); 
router.route("/manager").get((req, res) => {
  res.status(200).json({ message: "Welcome, Manager!" });
});

router.use(verifyJWT, verifyRole("admin")); 
router.route("/admin").get((req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});


export default router;
