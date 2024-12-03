const pool = require("../config/db");
const crypto = require("crypto");
const { getSession, deleteSession } = require("./retailerSessionModel");
const { count } = require("console");

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const adminSessionModel = {
  createSession: async (adminId) => {
    const sessionToken = generateSessionToken();
    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // in 1 day

    if (expireAt <= Date.now()) {
      throw new Error("Invalid expiry time");
    }

    try {
      const [result] = await pool.execute(
        `INSERT INTO admin_sessions (admin_id, session_token, expires_at) VALUES (?, ?, ?)`,
        [adminId, sessionToken, expireAt]
      );

      if (result.affectedRows === 0) {
        throw new Error("Session creation failed, no rows affected");
      }

      console.log(
        `Session created for adminId: ${adminId}, Session Token: ${sessionToken}`
      );

      return sessionToken;
    } catch (error) {
      console.error(`Error creating session for adminId: ${adminId}`, error);
      throw new Error(`Error creating session: ${error.message}`);
    }
  },

  getSession: async (sessionToken) => {
    if (!sessionToken) {
      throw new Error("Session token is required");
    }

    try {
      const [rows] = await pool.execute(
        `SELECT admin_id, expires_at FROM admin_sessions WHERE session_token = ?`,
        [sessionToken]
      );

      if (rows.length === 0) {
        console.error(`No session found for token: ${sessionToken}`);
        return null;
      }

      const session = rows[0];

      if (new Date(session.expireAt) < new Date()) {
        console.error(`Session expired for token: ${sessionToken}`);
        return null;
      }

      console.log(
        `Session fetched for adminId: ${session.admin_id}, Session Token: ${sessionToken}`
      );

      return session;
    } catch (error) {
      console.error(
        `Error fetching session for token: ${sessionToken}`,
        error.message
      );
      throw new Error("Error fetching session: " + error.message);
    }
  },

  deleteSession: async (sessionToken) => {
    if (!sessionToken) {
      throw new Error("Session token is required");
    }

    try {
      const [rows] = await pool.execute(
        `DELETE FROM admin_sessions WHERE session_token = ?`,
        [sessionToken]
      );

      if (result.affectedRows === 0) {
        console.error(`No session found with token: ${sessionToken}`);
        return null;
      }

      console.log(
        `Session with token ${sessionToken} has been deleted successfully.`
      );

      return true;
    } catch (error) {
      console.error(`Error deleting session for token: ${sessionToken}`, error);
      throw new Error("Error deleting session: " + error.message);
    }
  },
};

module.exports = adminSessionModel;
