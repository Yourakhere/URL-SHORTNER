const express = require("express");
const {
  handleGenerateNewShotURL,
  handleGenerateAnalytics,
  handleGetTotalVisits
} = require("../controllers/url.js");

const router = express.Router();

router.post("/", handleGenerateNewShotURL);
router.get("/analytics/:shortId", handleGenerateAnalytics);
router.get("/total-visits", handleGetTotalVisits);

module.exports = router;
