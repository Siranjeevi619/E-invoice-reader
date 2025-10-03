const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const uploadSchema = new mongoose.Schema({
  uploadId: {
    type: String,
    default: () => uuid(),
    unique: true,
  },
  filename: String,
  country: String,
  erp: String,
  rowsParsed: Number,
  rawContent: String,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Upload", uploadSchema);
