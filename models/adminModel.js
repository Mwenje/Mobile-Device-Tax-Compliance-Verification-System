const pool = require("../config/db");

const adminModel = {
  createAdmin: async (name, email, password) => {
    try {
      const [result] = await pool.execute(
        `INSERT INTO admin (name, email, password) VALUES (?, ?, ?)`,
        [name, email, password]
      );

      return {
        success: true,
        message: "Admin created successfully",
        adminId: result.insertId, // return the new admin's ID
      };
    } catch (error) {
      console.error(`Error creating admin: ${error.message}`);
      throw new Error("Failed to create admin");
    }
  },
  getAdminByEmail: async (email) => {
    try {
      const [rows] = await pool.execute(`SELECT * FROM admin WHERE email = ?`, [
        email,
      ]);

      if (rows.length === 0) {
        throw new Error("Admin not found");
      }

      return rows[0];
    } catch (error) {
      console.error("Error retrieving admin by email:", error.message);
      throw new Error("Failed to retrieve admin");
    }
  },

  updateAdminProfile: async (adminId, name, email) => {
    try {
      const [result] = await pool.execute(
        `UPDATE admin SET name =?,email =? WHERE admin_id=?`,
        [name, email, adminId]
      );

      if (result.affectedRows === 0) {
        throw new Error(`No admin found with ID ${adminId}`);
      }

      return {
        success: true,
        message: "Admin profile updated successfully",
      };
    } catch (error) {}
  },
  deleteAdmin: async (adminId) => {
    try {
      const [result] = await pool.execute(
        `DELETE FROM admin WHERE admin_id = ?`,
        [adminId]
      );

      if (result.affectedRows === 0) {
        throw new Error(`No admin found with ID ${adminId}`);
      }

      return {
        success: true,
        message: "Admin deleted successfully",
      };
    } catch (error) {
      console.error(`Error deleting admin: ${error.message}`);
      throw new Error("Failed to delete admin");
    }
  },

  isEmailTaken: async (email) => {
    try {
      const [rows] = await pool.execute(`SELECT * FROM admin WHERE email = ?`, [
        email,
      ]);
      return rows.length > 0;
    } catch (error) {
      console.error(`Error checking if email is taken: ${error.message}`);
      throw new Error("Failed to check email");
    }
  },

  updateAdminPassword: async (adminId, newPassword) => {
    try {
      const [result] = await pool.execute(
        `UPDATE admin SET password = ? WHERE admin_id = ?`,
        [newPassword, adminId]
      );

      if (result.affectedRows === 0) {
        throw new Error(`No admin found with ID ${adminId}`);
      }

      return {
        success: true,
        message: "Admin password updated successfully",
      };
    } catch (error) {
      console.error(`Error updating admin password: ${error.message}`);
      throw new Error("Failed to update admin password");
    }
  },
};
module.exports = adminModel;
