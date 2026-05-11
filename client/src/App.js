import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [font, setFont] = useState(null);
  const [inkColor, setInkColor] = useState("blue");
  const [pageType, setPageType] = useState("ruled");
  const [scanMode, setScanMode] = useState("normal");
  const [loading, setLoading] = useState(false);

  const handleFontChange = (e) => {
    setFont(e.target.files[0]);
  };

  const handleGenerate = async () => {
    try {
      if (!font) {
        alert("Please upload a handwriting font (.ttf)");
        return;
      }

      if (!text.trim()) {
        alert("Please enter assignment text");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("font", font);
      formData.append("inkColor", inkColor);
      formData.append("pageType", pageType);
      formData.append("scanMode", scanMode); // IMPORTANT for scan feature

      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend generation failed");
      }

      // Download PDF (multi-page)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "handwritten-assignment.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Generation failed. Check backend terminal.");
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>📝 Handwriting Assignment Generator</h1>
        <p className="subtitle">
          Realistic handwritten pages with scan & PDF export
        </p>

        {/* FONT UPLOAD */}
        <div className="section">
          <label>Upload Handwriting Font (.ttf)</label>
          <input
            type="file"
            accept=".ttf"
            onChange={handleFontChange}
          />
        </div>

        {/* INK COLOR */}
        <div className="section">
          <label>Pen Ink Style</label>
          <select
            value={inkColor}
            onChange={(e) => setInkColor(e.target.value)}
          >
            <option value="blue">Blue Ball Pen (Realistic)</option>
            <option value="black">Black Pen</option>
            <option value="gel">Blue Gel Pen</option>
          </select>
        </div>

        {/* PAGE TYPE */}
        <div className="section">
          <label>Page Style</label>
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
          >
            <option value="ruled">Ruled Notebook Page</option>
            <option value="plain">Plain Paper</option>
          </select>
        </div>

        {/* SCAN MODE (NEW FEATURE) */}
        <div className="section">
          <label>Scan Realism Mode</label>
          <select
            value={scanMode}
            onChange={(e) => setScanMode(e.target.value)}
          >
            <option value="normal">Normal Color (Clean)</option>
            <option value="scan_bw">Scanned Grayscale (Scanner Look)</option>
            <option value="xerox">Xerox Black & White (Classroom Copy)</option>
          </select>
        </div>

        {/* TEXT INPUT */}
        <div className="section">
          <label>Assignment Text</label>
          <textarea
            rows="14"
            placeholder="Paste your full assignment text here... (supports multi-page PDF)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* GENERATE BUTTON */}
        <button
          className="generateBtn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading
            ? "Generating Realistic PDF..."
            : "Generate Handwritten Assignment (PDF)"}
        </button>
      </div>
    </div>
  );
}

export default App;