import express from "express";
import multer from "multer";
import xlsToJson from "xls-to-json-lc";
import { Parser } from "json2csv";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("file"), (req, res) => {
  const filePath = req.file.path;

  xlsToJson({ input: filePath, output: null }, (err, result) => {
    fs.unlinkSync(filePath); // Supprime fichier temporaire
    if (err) return res.status(500).json({ error: "Conversion failed", details: err });

    const parser = new Parser();
    const csv = parser.parse(result);

    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  });
});

app.listen(3000, () => console.log("✅ API XLS to CSV running on port 3000"));
