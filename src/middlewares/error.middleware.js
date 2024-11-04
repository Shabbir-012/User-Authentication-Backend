// src/middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: err.errors || null,
    });
  };
  
  export default errorHandler;