const express = require("express");
const router = express.Router();
const {
  postUpload,
  postAnalyze,
  upload,
} = require("../controller/uploadController");

router.post("/upload", upload.single("file"), postUpload);
router.post("/analyze", postAnalyze);

module.exports = router;
