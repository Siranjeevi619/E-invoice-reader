const Upload = require("../model/upload");
const Report = require("../model/report");
const { analyzeData, normalizeData } = require("../services/analyzerService");
const fs = require("fs");
const multer = require("multer");
const csv = require("csv-parser");
const { Readable } = require("stream");

const upload = multer({ dest: "uploads/" });

const postUpload = async (req, res) => {
  try {
    let rawContent = "";
    if (req.file) {
      rawContent = fs.readFileSync(req.file.path, "utf8");
      fs.unlinkSync(req.file.path);
    } else if (req.body.text) {
      rawContent = req.body.text;
    } else return res.status(400).json({ error: "No file or text provided" });

    const uploadDoc = await Upload.create({
      filename: req.file?.originalname || "pasted_text",
      country: req.body.country || "UAE",
      erp: req.body.erp || "SAP",
      rawContent,
    });

    res.json({ uploadId: uploadDoc._id });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
};

const parseCSV = async (raw) =>
  new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(raw)
      .pipe(csv())
      .on("data", (row) => {
        if (rows.length < 200) rows.push(row);
      })
      .on("end", () => resolve(rows))
      .on("error", reject);
  });

const postAnalyze = async (req, res) => {
  try {
    const { uploadId } = req.body;
    const uploadDoc = await Upload.findById(uploadId);
    if (!uploadDoc) return res.status(404).json({ error: "Upload not found" });

    let data;
    try {
      const raw = JSON.parse(uploadDoc.rawContent);
      data = Array.isArray(raw) ? normalizeData(raw) : [];
    } catch {
      data = await parseCSV(uploadDoc.rawContent);
      data = normalizeData(data);
    }

    const reportJson = analyzeData(data, uploadDoc);
    await Report.create({
      uploadId,
      reportJson,
      scoresOverall: reportJson.scores.overall,
    });

    res.json(reportJson);
  } catch {
    res.status(500).json({ error: "Analyze failed" });
  }
};

module.exports = { postUpload, postAnalyze, upload };
