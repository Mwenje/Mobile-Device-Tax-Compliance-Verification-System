const pool = require("../config/db");

const retailerModel = {
  getRetailerByEmail: async (email) => {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM retailer WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) {
        throw new Error("Retailer not found");
      }

      return rows[0];
    } catch (error) {
      console.error("Error retrieving retailer by email:", error.message);
      throw new Error("Failed to retrieve retailer");
    }
  },

  createRetailer: async (
    name,
    pin,
    email,
    hashedPassword,
    county,
    building,
    phone
  ) => {
    try {
      const [result] = await pool.execute(
        `INSERT INTO retailer (name, pin, email, password, county, building, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, pin, email, hashedPassword, county, building, phone]
      );

      //   // Success response
      //   console.log(
      //     `Retailer created successfully. Retailer ID: ${result.insertId}`
      //   );

      return {
        success: true,
        message: "Retailer profile updated successfully",
        result: result.insertId,
      };
    } catch (error) {
      console.error("Error creating retailer:", error);
      throw new Error("Failed to create retailer");
    }
  },

  updateRetailerProfile: async (retailerId, name, county, building, phone) => {
    try {
      const [result] = await pool.execute(
        `UPDATE retailer SET name = ?, county = ?, building = ?, phone = ? WHERE retailer_id = ?`,
        [name, county, building, phone, retailerId]
      );

      // Check if any rows were updated
      if (result.affectedRows === 0) {
        throw new Error(`No retailer found with ID ${retailerId}`);
      }

      //   console.log(
      //     `Retailer profile updated successfully. Retailer ID: ${retailerId}`
      //   );

      return {
        success: true,
        message: "Retailer profile updated successfully",
      };
    } catch (error) {
      console.error("Error updating retailer profile:", error);
      throw new Error("Failed to update retailer profile");
    }
  },

  //to be used by the admins

  deleteRetailer: async (retailerId) => {
    try {
      const [result] = await pool.execute(
        `DELETE FROM retailer WHERE retailer_id = ?`,
        [retailerId]
      );

      if (result.affectedRows === 0) {
        throw new Error(`No retailer found with ID ${retailerId}`);
      }

      return {
        success: true,
        message: "Retailer deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting retailer:", error.message);
      throw new Error("Failed to delete retailer");
    }
  },

  getAllRetailers: async () => {
    try {
      const [rows] = await pool.execute(`SELECT * FROM retailer`);
      return rows;
    } catch (error) {
      console.error("Error retrieving all retailers:", error.message);
      throw new Error("Failed to retrieve all retailers");
    }
  },

  isEmailTaken: async (email) => {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM retailer WHERE email = ?`,
        [email]
      );
      return rows.length > 0;
    } catch (error) {
      console.error("Error checking if email is taken:", error.message);
      throw new Error("Failed to check email availability");
    }
  },
};

module.exports = retailerModel;
