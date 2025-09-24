require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const URL = require("./models/url");
const urlRoutes = require("./routes/url");
const { connectionToMongoDB } = require("./connect");

const app = express();
const PORT = process.env.PORT;  
 
app.use(
  cors({
    origin: "https://yourakhere-url.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/url", urlRoutes);

connectionToMongoDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB", error);
  });

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error handling redirect:", error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => console.log(`🚀 Server is running on PORT ${PORT}`));

