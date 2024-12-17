const phoneDeclarationModel = require("../models/phoneDeclarationModel");

const declarationController = {
  getAllDeclarations: async (req, res) => {
    try {
      const declarations = await phoneDeclarationModel.getAll();

      if (declarations.length === 0) {
        return res.status(404).json({ message: "No declarations found" });
      }

      res.status(200).json({
        data: declarations,
        message: "Declarations retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching declarations:", error.message);

      res.status(500).json({
        message:
          "An error occurred while fetching declarations. Please try again later.",
      });
    }
  },

  deleteDeclarationById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const result = await phoneDeclarationModel.deleteById(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Declaration not found" });
      }

      return res
        .status(200)
        .json({ message: "Declaration deleted successfully.", result: result });
    } catch (error) {
      console.error("Error deleting declaration:", error.message);

      res.status(500).json({
        message:
          "An error occurred while deleting the declaration. Please try again later.",
      });
    }
  },

  getRetailerDeclarations: async (req, res) => {
    try {
      const retailerId = req.retailerId;

      if (!retailerId || isNaN(retailerId)) {
        return res.status(400).json({ message: "Invalid retailer ID format" });
      }

      const declarations = await phoneDeclarationModel.getByRetailerId(
        retailerId
      );

      if (declarations.length === 0) {
        return res
          .status(404)
          .json({ message: "No declarations found for this retailer" });
      }

      return res.status(200).json({
        message: "Declarations fetched successfully",
        data: declarations,
      });
    } catch (error) {
      console.error("Error fetching retailer declarations:", error.message);

      res.status(500).json({
        message:
          "An error occurred while fetching the retailer's declarations. Please try again later.",
      });
    }
  },

  createDeclaration: async (req, res) => {
    const {
      IMEI,
      model,
      serial_number,
      amount_sold,
      CU_invoice_number,
      warranty_period,
    } = req.body;

    const retailerId = req.retailerId;

    if (
      !IMEI ||
      !model ||
      !serial_number ||
      !amount_sold ||
      !CU_invoice_number ||
      !warranty_period
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(amount_sold) || amount_sold <= 0) {
      return res
        .status(400)
        .json({ message: "Amount sold must be a positive number." });
    }

    const warrantyDate = new Date(warranty_period);

    if (isNaN(warrantyDate.getTime())) {
      return res.status(400).json({
        message: "Invalid warranty period format. It should be a valid date.",
      });
    }

    try {
      console.log(`Creating declaration for retailer ${retailerId}`);

      const declaration_id = await phoneDeclarationModel.create({
        retailer_id: retailerId,
        IMEI,
        model,
        serial_number,
        amount_sold,
        CU_invoice_number,
        warranty_period,
      });

      res.status(201).json({
        message: "Declaration created successfully.",
        declaration_id: declaration_id,
      });
    } catch (error) {
      console.error("Error creating declaration:", error.message);

      res.status(500).json({
        message: "Error creating declaration. Please try again later.",
      });
    }
  },

  updateDeclaration: async (req, res) => {
    const { id } = req.params;
    const {
      IMEI,
      model,
      serial_number,
      amount_sold,
      CU_invoice_number,
      warranty_period,
    } = req.body;
    const retailerId = req.retailerId;

    if (
      !IMEI ||
      !model ||
      !serial_number ||
      !amount_sold ||
      !CU_invoice_number ||
      !warranty_period
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(amount_sold) || amount_sold <= 0) {
      return res
        .status(400)
        .json({ message: "Amount sold must be a positive number." });
    }

    const warrantyDate = new Date(warranty_period);
    if (isNaN(warrantyDate.getTime())) {
      return res.status(400).json({
        message: "Invalid warranty period format. It should be a valid date.",
      });
    }

    try {
      const declaration = await phoneDeclarationModel.getById(id);

      if (!declaration || declaration.retailer_id !== retailerId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this declaration." });
      }

      await phoneDeclarationModel.update(id, {
        IMEI,
        model,
        serial_number,
        amount_sold,
        CU_invoice_number,
        warranty_period,
      });

      res.status(200).json({ message: "Declaration updated successfully." });
    } catch (error) {
      console.error("Error updating declaration:", error);

      res.status(500).json({
        message: "Error updating declaration. Please try again later.",
      });
    }
  },

  deleteRetailerDeclaration: async (req, res) => {
    const { id } = req.params;
    const retailerId = req.retailerId;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid declaration ID." });
    }

    try {
      const declaration = await phoneDeclarationModel.getById(id);

      if (!declaration) {
        return res.status(404).json({ message: "Declaration not found." });
      }

      if (declaration.retailer_id !== retailerId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this declaration." });
      }

      await phoneDeclarationModel.deleteById(id);

      console.log(`Retailer ${retailerId} deleted declaration ${id}`);

      res.status(200).json({ message: "Declaration deleted successfully." });
    } catch (error) {
      console.error("Error deleting declaration:", error);

      res.status(500).json({
        message: "Error deleting declaration. Please try again later.",
      });
    }
  },
};
module.exports = declarationController;
