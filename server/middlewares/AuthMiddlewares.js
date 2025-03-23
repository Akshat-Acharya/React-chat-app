const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  console.log("🔹 Request Cookies:", req.cookies);

  const token = req.cookies?.jwt;

  if (!token) {
    console.log("❌ No token found");
    return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.error("❌ Token Verification Failed:", err.message);
      return res.status(403).json({ success: false, message: "Token not valid" });
    }

    console.log("✅ Token Verified:", payload);

    // Ensure `userId` exists in payload
    if (!payload.userId) {
      console.error("❌ Error: userId is missing in token payload");
      return res.status(403).json({ success: false, message: "Invalid token structure" });
    }

    req.userId = payload.userId; // ✅ Set userId correctly
    console.log("✅ Request userId set:", req.userId); // Debugging log
    next();
  });
};
