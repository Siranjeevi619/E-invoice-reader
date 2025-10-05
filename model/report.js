const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const reportSchema = new mongoose.Schema({
  reportId: { type: String, default: () => uuid(), unique: true },
  uploadId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload" },
  reportJson: Object,
  scoresOverall: Number,
  createdAt: { type: Date, default: Date.now, expires: 7 * 24 * 60 * 60 },
});

module.exports = mongoose.model("Report", reportSchema);
