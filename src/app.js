//src/app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // methods: ["GET", "POST", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // dekhte hobe
app.use(cookieParser());

// routes import

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);
app.use(errorHandler);

export { app };
