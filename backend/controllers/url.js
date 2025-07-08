const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShotURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });

  const shortID = nanoid(8);

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
}

async function handleGenerateAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
} 
async function handleGetTotalVisits(req, res) {
  try {
    const urls = await URL.find({});
    const total = urls.reduce((sum, url) => sum + url.visitHistory.length, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch total visits" });
  }
}

module.exports = {
  handleGenerateNewShotURL,
  handleGenerateAnalytics,
  handleGetTotalVisits
};
 