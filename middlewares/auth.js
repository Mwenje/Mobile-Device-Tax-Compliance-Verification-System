const retailerSessionModel = require("../models/retailerSessionModel");
const adminSessionModel = require("../models/adminSessionModel");

const verifySession = async (sessionToken, sessionModel, sessionType) => {
  if (!sessionToken) {
    throw new Error("Session token format is invalid.");
  }

  const sessionData = await sessionModel.getSession(sessionToken);

  if (!sessionData) {
    console.error(`${sessionType} session not found for token:`, sessionToken);
    throw new Error("Unauthorized. Invalid or expired session token.");
  }

  const sessionExpiryTime = new Date(sessionData.expires_at).getTime();
  const currentTime = new Date().getTime();

  if (sessionExpiryTime < currentTime) {
    console.error(`${sessionType} session expired for token:`, sessionToken);
    throw new Error("Unauthorized. Invalid or expired session token.");
  }

  return sessionData;
};

const authMiddleware = {
  retailerAuth: async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No session token provided." });
    }

    const sessionToken = authorizationHeader.split(" ")[1];

    try {
      const sessionData = await verifySession(
        sessionToken,
        retailerSessionModel,
        "Retailer"
      );

      req.retailerId = sessionData.retailer_id;

      next();
    } catch (err) {
      console.error("Retailer Auth Error:", error.message);
      res.status(500).json({ message: "Internal server error." });
    }
    // if (req.session && req.session.retailer) {
    //   // Session exists and retailer is logged in
    //   next();
    // } else {
    //   // No valid session; user is not authenticated
    //   res.status(401).json({ message: "Unauthorized access. Please log in." });
    // }
  },

  adminAuth: async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];

    const sessionToken = authorizationHeader.split(" ")[1];

    try {
      const sessionData = await verifySession(
        sessionToken,
        adminSessionModel,
        "Admin"
      );

      req.adminId = sessionData.admin_id;
      next();
    } catch (error) {
      console.error("Admin Auth Error:", error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  },
};

module.exports = authMiddleware;
