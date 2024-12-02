const retailerSessionModel = require("../models/retailerSessionModel");
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

    const isTaken = await retailerModel.isEmailTaken(email);

    if (isTaken) {
      return res.status(400).json({ message: "Email is already taken" });
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
      console.error("Error registering retailer:", error.message);

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
      // req.session.retailer = {
      //   id: retailer.retailer_id,
      //   name: retailer.name,
      //   email: retailer.email,
      // };

      // session expiration time
      // req.session.cookie.expires = new Date(Date.now() + 3600000); // for 1 hour
      const sessionToken = await retailerSessionModel.createSession(
        retailer.retailer_id
      );

      res.status(200).json({
        message: "Login successful.",
        retailer_id: retailer.retailer_id,
        name: retailer.name,
        email: retailer.email,
        sessionToken: sessionToken,
      });
    } catch (error) {
      console.error("Error logging in:", error);

      res.status(500).json({
        message: "Error logging in. Please try again later.",
      });
    }
  },

  updateProfile: async (req, res) => {
    const { name, email, county, building, phone } = req.body;

    console.log(name, email, county, building, phone);

    // const retailerId = req.session.retailer?.id;

    const isTaken = await retailerModel.isEmailTaken(email);

    if (isTaken) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    // console.log(retailerId);
    const sessionToken = req.headers["authorization"]?.split(" ")[1];

    if (!sessionToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No session token provided." });
    }

    try {
      const sessionData = await retailerSessionModel.getSession(sessionToken);

      if (!sessionData) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Invalid or expired session token." });
      }

      const retailerId = sessionData.retailer_id;

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
    // req.session.retailer = null;
    // req.session.destroy((err) => {
    //   if (err) {
    //     console.error("Error destroying session:", err);
    //     return res
    //       .status(500)
    //       .json({ message: "Error logging out. Please try again later." });
    //   }
    //   res.status(200).json({ message: "Logout successful." });
    //   //   return res.redirect("/public/index.html");
    // });
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      return res.status(400).json({ message: "No session token provided." });
    }

    const sessionToken = authorizationHeader.split(" ")[1]; // Bearer Token

    if (!sessionToken) {
      return res.status(400).json({
        message: "Session token is missing in Authorization header.",
      });
    }

    try {
      const result = await retailerSessionModel.deleteSession(sessionToken);

      if (result) {
        return res.status(200).json({ message: "Logout successful." });
      } else {
        return res
          .status(404)
          .json({ message: "Session not found or already expired." });
      }
    } catch (error) {
      console.error("Error logging out:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  // to be used by admins
  getAllRetailers: async (req, res) => {
    try {
      const retailers = await retailerModel.getAllRetailers();

      return res.status(200).json({
        message: "Retailers fetched successfully",
        data: retailers,
      });
    } catch (error) {
      console.error("Error fetching retailers:", error.message);
      return res.status(500).json({
        message: "Error fetching retailers. Please try again later.",
      });
    }
  },

  deleteRetailer: async (req, res) => {
    const { retailerId } = req.params;

    try {
      const result = await retailerModel.deleteRetailer(retailerId);
      return res
        .status(200)
        .json({ message: "Retailer Deleted successuly.", result: result });
    } catch (error) {
      console.error("Error Deleting Retailer:", error.message);
      return res.status(500).json({
        message: "Failed to delete Retailer Please. Try again later.",
      });
    }
  },
};

module.exports = retailerControler;
