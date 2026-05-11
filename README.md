# 📝 Realistic Handwriting Assignment Generator

A full-stack web application that converts typed text into realistic handwritten notebook assignments using custom `.ttf` handwriting fonts.

The project uses a React frontend, a Node.js + Express backend, and a Python rendering engine powered by Pillow for generating highly realistic handwritten pages with notebook textures, scan effects, and multi-page PDF export.

---

# ✨ Features

* Upload custom handwriting `.ttf` fonts
* Convert typed text into handwritten notebook pages
* Realistic notebook-style page rendering
* Blue ball pen / gel pen / black pen ink styles
* Scanned grayscale mode
* Xerox black & white mode
* Automatic multi-page PDF generation
* Realistic paper textures and notebook lines
* Human-like handwriting imperfections and alignment
* Download generated handwritten assignments as PDF

---

# 🛠️ Tech Stack

## Frontend

* React.js
* CSS

## Backend

* Node.js
* Express.js
* Multer

## Rendering Engine

* Python
* Pillow
* ReportLab

---

# 📁 Project Structure

```bash
handwriting-generator/
│
├── client/                 # React frontend
│   ├── src/
│   └── public/
│
├── server/                 # Node + Python backend
│   ├── index.js
│   ├── renderer.py
│   ├── uploads/
│   └── output/
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd handwriting-generator
```

---

## 2️⃣ Setup Frontend

```bash
cd client
npm install
npm start
```

Frontend runs at:

```bash
http://localhost:3000
```

---

## 3️⃣ Setup Backend

Open a new terminal:

```bash
cd server
npm install
```

Install Python dependencies:

```bash
pip install pillow reportlab
```

Run backend:

```bash
node index.js
```

Backend runs at:

```bash
http://localhost:5000
```

---

# 🚀 Usage

1. Start both frontend and backend servers
2. Upload a custom handwriting `.ttf` font
3. Paste assignment text
4. Select:

   * Pen ink style
   * Notebook page style
   * Scan realism mode
5. Click:

```bash
Generate Handwritten Assignment
```

6. Download the generated multi-page handwritten PDF

---

# 📸 Realism Features

The rendering engine includes:

* Notebook paper textures
* Handwriting baseline jitter
* Ink pressure variation
* Scan and Xerox simulation
* Slight blur for pen bleed realism
* Realistic notebook margins and ruled lines
* Multi-page handwritten PDF rendering

---

# 🔮 Future Improvements

* Phone camera scan simulation
* Handwriting fatigue effect
* AI-generated handwriting styles
* Cloud font storage
* User authentication
* Drag-and-drop PDF upload
* Real-time preview generation

---

# 👨‍💻 Author

Developed by Yuvraj Rajoriya.
