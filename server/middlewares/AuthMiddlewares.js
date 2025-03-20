const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  console.log("🔹 Request Cookies:", req.cookies);

  const token = req.cookies?.jwt;

  if (!token) {
    console.log("❌ No token found");
    return res
      .status(401)
      .json({ success: false, message: "Access Denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      console.error("❌ Token Verification Failed:", err.message);
      return res.status(403).json({
        success: false,
        message: "Token not valid",
      });
    }

    console.log("✅ Token Verified:", payload);
    req.userId = payload.userId;
    next();
  });
};
