const express = require("express");
const declarationController = require("../controllers/declarationController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Admin Routes
router.get(
  "/admin/declarations",
  authMiddleware.adminAuth,
  declarationController.getAllDeclarations
);
router.delete(
  "/admin/declarations/:id",
  authMiddleware.adminAuth,
  declarationController.deleteDeclarationById
);

// Retailer Routes
router.get(
  "/retailer/declarations",
  authMiddleware.retailerAuth,
  declarationController.getRetailerDeclarations
);
router.post(
  "/declarations",
  authMiddleware.retailerAuth,
  declarationController.createDeclaration
);
router.put(
  "/retailer/:id",
  authMiddleware.retailerAuth,
  declarationController.updateDeclaration
);
router.delete(
  "/declarations/:id",
  authMiddleware.retailerAuth,
  declarationController.deleteRetailerDeclaration
);

module.exports = router;
