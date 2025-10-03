const Upload = require("../model/upload");
const Report = require("../model/report");
const { analyzeData } = require("../services/analyzerService");
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
    } else {
      return res.status(400).json({ error: "No file or text provided" });
    }

    const uploadDoc = await Upload.create({
      filename: req.file?.originalname || "pasted_text",
      country: req.body.country || "UAE",
      erp: req.body.erp || "SAP",
      rawContent,
    });

    res.json({ uploadId: uploadDoc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload failed" });
  }
};

const parseCSV = async (raw) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(raw)
      .pipe(csv())
      .on("data", (row) => {
        if (rows.length < 200) rows.push(row);
      })
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
};

const postAnalyze = async (req, res) => {
  try {
    const { uploadId, questionnaire } = req.body;
    const uploadDoc = await Upload.findById(uploadId);
    if (!uploadDoc) return res.status(404).json({ error: "Upload not found" });

    let data;
    try {
      data = JSON.parse(uploadDoc.rawContent);
    } catch (e) {
      try {
        data = await parseCSV(uploadDoc.rawContent);
      } catch (err) {
        return res.status(400).json({ error: "Invalid file format" });
      }
    }

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Parsed data is not an array" });
    }

    const reportJson = analyzeData(data, questionnaire);

    const reportDoc = await Report.create({
      uploadId,
      reportJson,
      scoresOverall: reportJson.scores.overall,
    });
    
    res.json(reportJson, reportDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analyze failed" });
  }
};

module.exports = { postUpload, postAnalyze, upload };
