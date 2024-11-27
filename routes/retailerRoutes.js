const express = require("express");
const retailerController = require("../controllers/retailerController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/register", retailerController.register);
router.post("/login", retailerController.login);
router.put(
  "/profile",
  authMiddleware.retailerAuth,
  retailerController.updateProfile
);
router.post("/logout", authMiddleware.retailerAuth, retailerController.logout);

module.exports = router;
