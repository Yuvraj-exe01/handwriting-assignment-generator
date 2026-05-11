const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads folder
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

// MAIN GENERATE ROUTE (Node → Python Renderer)
app.post("/generate", upload.single("font"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No font uploaded");
    }

    const text = req.body.text || "";
    const inkColor = req.body.inkColor || "blue";
    const pageType = req.body.pageType || "ruled";
    const fontPath = req.file.path;
    const outputPath = path.join(__dirname, "output.png");

    const pythonScript = path.join(__dirname, "renderer.py");

    // Call Python rendering engine (Pillow)
    const scanMode = req.body.scanMode || "normal";

execFile(
  "python",
  [pythonScript, text, fontPath, inkColor, pageType, scanMode],
      (error, stdout, stderr) => {
        if (error) {
          console.error("Python Execution Error:", error);
          console.error("STDERR:", stderr);
          return res.status(500).send("Generation failed (Python error)");
        }

        if (!fs.existsSync(outputPath)) {
          return res.status(500).send("Output image not generated");
        }

        res.download(path.join(__dirname, "assignment.pdf"));
      }
    );
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});