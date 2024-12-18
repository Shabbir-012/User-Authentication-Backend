// src/middlewares/role.middleware.js

const verifyRule = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Acess denied" });
    }
    next();
  };
};

export default verifyRule;
