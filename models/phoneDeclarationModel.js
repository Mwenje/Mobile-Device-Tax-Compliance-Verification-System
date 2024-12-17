const pool = require("../config/db");

const phoneDeclarationModel = {
  getAll: async () => {
    try {
      const [rows] = await pool.execute("SELECT * FROM phone_declaration");

      if (rows.length === 0) {
        return { message: "No data found" };
      }

      return rows;
    } catch (error) {
      console.log("Error fetching data from Phone_Declaration:", error.message);
      throw new Error("Error fetching data");
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM phone_declaration WHERE declaration_id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return { message: "No data found for the given ID" };
      }

      return rows[0];
    } catch (error) {
      console.log(
        "Error fetching data by ID from Phone_Declaration:",
        error.message
      );

      throw new Error("Error fetching data by ID");
    }
  },

  getByRetailerId: async (retailerId) => {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM phone_declaration WHERE retailer_id = ?`,
        [retailerId]
      );

      if (rows.length === 0) {
        return { message: "No data found for the given retailer ID" };
      }

      return rows;
    } catch (error) {
      console.error(
        "Error fetching data by retailer_id from Phone_Declaration:",
        error.message
      );

      throw new Error("Error fetching data by retailer ID");
    }
  },

  create: async (data) => {
    const {
      retailer_id,
      IMEI,
      model,
      serial_number,
      amount_sold,
      CU_invoice_number,
      warranty_period,
    } = data;

    try {
      const [result] = await pool.execute(
        `INSERT INTO phone_declaration (retailer_id, IMEI, model, serial_number, amount_sold, CU_invoice_number, warranty_period) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          retailer_id,
          IMEI,
          model,
          serial_number,
          amount_sold,
          CU_invoice_number,
          warranty_period,
        ]
      );

      return {
        success: true,
        message: "Phone Declared successfully",
        adminId: result.insertId, // return the new admin's ID
      };
    } catch (error) {
      console.error(
        "Error inserting data into Phone_Declaration:",
        error.message
      );

      throw new Error("Error inserting data");
    }
  },

  update: async (id, data) => {
    const {
      IMEI,
      model,
      serial_number,
      amount_sold,
      CU_invoice_number,
      warranty_period,
    } = data;

    try {
      const [result] = await pool.execute(
        `UPDATE phone_declaration SET IMEI = ?, model = ?, serial_number = ?, amount_sold = ?, CU_invoice_number = ?, warranty_period = ? WHERE declaration_id = ?`,
        [
          IMEI,
          model,
          serial_number,
          amount_sold,
          CU_invoice_number,
          warranty_period,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return { message: "No records were updated. Please check the ID." };
      }

      return { success: true, message: "Phone Declared updated successfully." };
    } catch (error) {
      console.error("Error updating data in Phone_Declaration:", error);

      throw new Error("Error updating data");
    }
  },

  deleteById: async (id) => {
    try {
      const [result] = await pool.execute(
        "DELETE FROM phone_declaration WHERE declaration_id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return { message: "No record found with the given ID" };
      }

      return { success: true, message: "Phone Declared deleted successfully." };
    } catch (error) {}
    console.error(
      "Error deleting record from Phone_Declaration:",
      error.message
    );

    throw new Error("Error deleting record");
  },
};

module.exports = phoneDeclarationModel;
