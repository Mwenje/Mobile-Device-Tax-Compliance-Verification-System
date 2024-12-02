const retailerSessionModel = require("../models/retailerSessionModel");

const authMiddleware = {
  retailerAuth: async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No session token provided." });
    }

    const sessionToken = authorizationHeader.split(" ")[1];

    if (!sessionToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Session token format is invalid." });
    }

    try {
      const sessionData = await retailerSessionModel.getSession(sessionToken);

      console.log(sessionData);

      if (!sessionData) {
        console.log("Session not found for token:", sessionToken);
        return res
          .status(401)
          .json({ message: "Unauthorized. Invalid or expired session token." });
      }

      console.log("Session Data:", sessionData);
      console.log("Session Expiry:", sessionData.expires_at);
      console.log("Current Time:", new Date());

      const sessionExpiryTime = new Date(sessionData.expires_at).getTime();
      const currentTime = new Date().getTime();

      console.log("Session Expiry Time:", sessionExpiryTime);
      console.log("Current Time:", currentTime);

      if (sessionExpiryTime < currentTime) {
        console.log("Session expired");
        return res
          .status(401)
          .json({ message: "Unauthorized. Invalid or expired session token." });
      }

      req.retailerId = sessionData.retailer_id;

      next();
    } catch (err) {
      console.error("Error verifying session:", err);
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
};

module.exports = authMiddleware;
