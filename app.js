const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");

const retailerRoutes = require("./routes/retailerRoutes");

const { retailerAuth } = require("./middlewares/auth");

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    maxAge: 1000 * 60 * 60,
  })
);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/retailer", retailerRoutes);

// Route to serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is runnig on http://localhost:${PORT}`);
});

// app.get("/api/v1/", async (req, res) => {
//   try {
//     const [rows] = await pool.execute("SELECT * FROM retailer");
//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No retailers found.",
//       });
//     }
//     res.json({
//       success: true,
//       message: "Database connected!",
//       solution: rows,
//     });
//   } catch (error) {
//     console.error("Database test failed:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Database connection failed.",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });
