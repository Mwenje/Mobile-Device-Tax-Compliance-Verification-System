const adminModel = require("../models/adminModel");
const bycrypt = require("bcryptjs");

const adminController = {
  createAdmin: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required (name, email, password)",
      });
    }

    // Validate email format
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const isTaken = await adminModel.isEmailTaken(email);

    if (isTaken) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one number and one special character",
      });
    }

    try {
      const hashedPassword = await bycrypt.hash(password, 10);

      const adminId = await adminModel.createAdmin(name, email, hashedPassword);

      return res.status(201).json({
        message: "Admin registered successfully.",
        retailer_id: adminId,
      });
    } catch (error) {
      console.error("Error registering Admin:", error.message);

      return res.status(500).json({
        message: "Error registering Admin. Please try again later.",
      });
    }
  },

  loginAdmin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    try {
      const admin = await adminModel.getAdminByEmail(email);

      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isMatch = await bycrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      return res.status(200).json({
        message: "Login successful.",
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
      });
    } catch (error) {
      console.error("Error logging in:", error.message);

      return res.status(500).json({
        message: "Error logging in. Please try again later.",
      });
    }
  },

  updateAdminProfile: async (req, res) => {
    const { adminId, name, email, newpassword } = req.body;

    try {
      let hashedPassword = null;
      if (newpassword) {
        hashedPassword = await bycrypt.hash(newpassword, 10);
      }

      console.log(adminId, name, email, hashedPassword);

      await adminModel.updateAdminProfile(adminId, name, email);

      if (hashedPassword) {
        await adminModel.updateAdminPassword(adminId, hashedPassword);
      }

      return res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      return res
        .status(500)
        .json({ message: "Error updating profile. Please try again later." });
    }
  },

  deleteAdmin: async (req, res) => {
    const { adminId } = req.params;

    try {
      const result = await adminModel.deleteAdmin(adminId);
      return res
        .status(200)
        .json({ message: "Admin Deleted successuly.", result: result });
    } catch (error) {
      console.error("Error Deleting Admin:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to delete admin Please. Try again later." });
    }
  },
};

module.exports = adminController;
