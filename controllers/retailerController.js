const bycrypt = require("bcryptjs");
const retailerModel = require("../models/retailerModel");
// const jwt = require("jsonwebtoken");

const retailerControler = {
  register: async (req, res) => {
    const { name, pin, email, password, county, building, phone } = req.body;

    // Input validation
    if (
      !name ||
      !pin ||
      !email ||
      !password ||
      !county ||
      !building ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "All fields are required (name, pin, email, password, county, building, phone)",
      });
    }

    // Validate email format
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate KRA pin (11 characters: 'P' or 'A', 0, 8 digits, and 1 alphanumeric character)
    const pinRegex = /^[PA]{1}0\d{8}[A-Za-z0-9]{1}$/;
    if (!pinRegex.test(pin)) {
      return res.status(400).json({
        message:
          "Invalid KRA PIN format. It should be in the format: P0XXXXXXXXR or A0XXXXXXXXN",
      });
    }

    // Password strength validation (e.g., at least 8 characters, with one number and one special character)
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

      const retailerId = await retailerModel.createRetailer(
        name,
        pin,
        email,
        hashedPassword,
        county,
        building,
        phone
      );

      // Success response
      res.status(201).json({
        message: "Retailer registered successfully.",
        retailer_id: retailerId,
      });
    } catch (error) {
      console.error("Error registering retailer:", error);

      res.status(500).json({
        message: "Error registering retailer. Please try again later.",
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    // validating the inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    try {
      const retailer = await retailerModel.getRetailerByEmail(email);

      if (!retailer) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      //comparing hashed passsword match
      const isMatch = await bycrypt.compare(password, retailer.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // session or token not yet decided REMENMBER(for future use in protected routes)
      req.session.retailer = {
        id: retailer.retailer_id,
        name: retailer.name,
        email: retailer.email,
      };

      // session expiration time
      req.session.cookie.expires = new Date(Date.now() + 3600000); // for 1 hour

      res.status(200).json({
        message: "Login successful.",
        retailer_id: retailer.retailer_id,
        name: retailer.name,
        email: retailer.email,
      });
    } catch (error) {
      console.error("Error logging in:", error);

      res.status(500).json({
        message: "Error logging in. Please try again later.",
      });
    }
  },

  updateProfile: async (req, res) => {
    const { name, county, building, phone } = req.body;
    const retailerId = req.session.retailer?.id;

    if (!retailerId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!name || !county || !building || !phone) {
      return res.status(400).json({
        message: "All fields are required (name, county, building, phone).",
      });
    }

    const phoneRegex = /^(?:\+254|07)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message:
          "Invalid phone number format. Please use the format: +2547xxxxxxx.",
      });
    }

    try {
      await retailerModel.updateRetailerProfile(
        retailerId,
        name,
        county,
        building,
        phone
      );

      res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json({ message: "Error updating profile. Please try again later." });
    }
  },

  logout: async (req, res) => {
    req.session.retailer = null;

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res
          .status(500)
          .json({ message: "Error logging out. Please try again later." });
      }

      res.status(200).json({ message: "Logout successful." });
      res.redirect("/login");
    });
  },
};

module.exports = retailerControler;
