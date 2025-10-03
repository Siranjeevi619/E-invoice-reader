const report = require("../model/report.js");
const Report = require("../model/report.js");

const getAllReport = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const total = await Report.countDocuments();

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      reports,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

const getReport = async (req, res) => {
  const reportId = req.params.reportId;
  console.log("reportId:", reportId);
  try {
    const report = await Report.findOne({ uploadId: reportId });

    if (!report) return res.status(404).json({ error: "Report not found" });

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

module.exports = { getReport, getAllReport };
