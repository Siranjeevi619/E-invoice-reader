const Upload = require("../model/upload");
const Report = require("../model/report");
const { analyzeData , normalizeData } = require("../services/analyzerService");
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

function normalizeRow(row) {
  return {
    invoice: {
      id: row.inv_id || row.invoice?.id,
      issue_date: row.date || row.invoice?.issue_date,
      currency: row.currency || row.invoice?.currency,
      total_excl_vat: parseFloat(
        row.total_excl_vat || row.invoice?.total_excl_vat || 0
      ),
      vat_amount: parseFloat(row.vat_amount || row.invoice?.vat_amount || 0),
      total_incl_vat: parseFloat(
        row.total_incl_vat || row.invoice?.total_incl_vat || 0
      ),
    },
    seller: {
      name: row.seller_name || row.seller?.name,
      trn: row.seller_trn || row.seller?.trn,
      country: row.seller_country || row.seller?.country,
      city: row.seller_city || row.seller?.city || "",
    },
    buyer: {
      name: row.buyer_name || row.buyer?.name,
      trn: row.buyer_trn || row.buyer?.trn,
      country: row.buyer_country || row.buyer?.country,
      city: row.buyer_city || row.buyer?.city || "",
    },
    lines:
      row.lines?.map((l) => ({
        sku: l.sku,
        description: l.description || "",
        qty: parseFloat(l.qty),
        unit_price: parseFloat(l.unit_price),
        line_total: parseFloat(l.line_total),
      })) || [],
  };
}
const parseCSV = async (raw) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(raw)
      .pipe(csv())
      .on("data", (row) => {
        if (rows.length < 200) rows.push(normalizeRow(row));
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
      const raw = JSON.parse(uploadDoc.rawContent);
      if (Array.isArray(raw)) data = raw.map(normalizeRow);
      else return res.status(400).json({ error: "JSON must be an array" });
    } catch (e) {
      try {
        data = await parseCSV(uploadDoc.rawContent);
      } catch (err) {
        return res.status(400).json({ error: "Invalid file format" });
      }
    }

    const reportJson = analyzeData(data, questionnaire);

    const reportDoc = await Report.create({
      uploadId,
      reportJson,
      scoresOverall: reportJson.scores.overall,
    });

    res.json(reportJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analyze failed" });
  }
};

module.exports = { postUpload, postAnalyze, upload };
