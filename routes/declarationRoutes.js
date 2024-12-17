const express = require("express");
const declarationController = require("../controllers/declarationController");

const router = express.Router();

// Admin Routes
router.get("/admin/declarations", declarationController.getAllDeclarations);
router.delete(
  "/admin/declarations/:id",
  declarationController.deleteDeclarationById
);

// Retailer Routes
router.get("/declarations", declarationController.getRetailerDeclarations);
router.post("/declarations", declarationController.createDeclaration);
router.put("/retailer/:id", declarationController.updateDeclaration);
router.delete(
  "/declarations/:id",
  declarationController.deleteRetailerDeclaration
);

module.exports = router;
