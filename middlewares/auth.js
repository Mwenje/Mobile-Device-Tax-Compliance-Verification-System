const authMiddleware = {
  retailerAuth: (req, res, next) => {
    if (req.session && req.session.retailer) {
      // Session exists and retailer is logged in
      next();
    } else {
      // No valid session; user is not authenticated
      res.status(401).json({ message: "Unauthorized access. Please log in." });
    }
  },
};

module.exports = authMiddleware;
