const mysql = require("mysql2");
const dotenv = require("dotenv"); // Load environment variables from .env file

dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "test",
  connectionLimit: process.env.DB_CONNECTIONLIMIT || 10,
});

// Error handling for pool creation
pool.getConnection((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1); // Exit the application if the connection pool cannot be created
  } else {
    console.log("Database connection pool created successfully!");
  }
});

module.exports = pool.promise();
