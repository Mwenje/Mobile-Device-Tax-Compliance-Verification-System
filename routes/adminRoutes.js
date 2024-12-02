const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/create", adminController.createAdmin);

router.post("/login", adminController.loginAdmin);

router.put("/profile", adminController.updateAdminProfile);

router.delete("/delete/:adminId", adminController.deleteAdmin);

module.exports = router;
