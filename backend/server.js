const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const text = data.text;

    const email = text.match(/\S+@\S+\.\S+/)?.[0] || "";
    const phone = text.match(/\d{10}/)?.[0] || "";
    const name = text.split("\n").find(l => l.trim().length > 2) || "";

    res.json({
      name,
      email,
      phone,
      skills: "",
      education: "",
      experience: ""
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

app.listen(5000, () => {
  console.log("Backend running: http://localhost:5000");
});

console.log("File received:", req.file.originalname);
console.log("Text length:", text.length);
