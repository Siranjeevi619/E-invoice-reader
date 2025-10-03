const express = require("express");
const router = express.Router();
const { getReport, getAllReport } = require("../controller/reportController");


router.get("/report/all", getAllReport);

router.get("/report/:reportId", getReport);

module.exports = router;
