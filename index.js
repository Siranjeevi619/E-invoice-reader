require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const uploadRoutes = require("./router/uploadRouter");
const reportRoutes = require("./router/reportRouter");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api", uploadRoutes);
app.use("/api", reportRoutes);

const PORT = process.env.PORT || 5000;

app.get("/health", async (req, res) => {
  let status = "DOWN";

  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      status = "UP";
    }
  } catch (err) {
    console.error("MongoDB ping failed:", err.message);
  }

  res.json({
    db: "mongodb",
    status,
  });
});

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
