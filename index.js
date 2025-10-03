require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const uploadRoutes = require("./router/uploadRouter");
const reportRoutes = require("./router/reportRouter");
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api", uploadRoutes);
app.use("/api", reportRoutes);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
