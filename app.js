const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

const app = express();

//configure environmental variables
dotenv.config();

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM retailer");

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No retailers found.",
      });
    }

    res.json({
      success: true,
      message: "Database connected!",
      solution: rows[0],
    });
  } catch (error) {
    console.error("Database test failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

//listen for the server on port 3000
app.listen(PORT, () => {
  console.log(`Server is runnig on http://localhost:${PORT}`);
});
