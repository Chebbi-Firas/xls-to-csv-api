import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import xlsToJson from "xls-to-json-lc";
import { Parser } from "json2csv";

const app = express();
app.use(express.raw({ type: "application/octet-stream", limit: "10mb" }));

app.post("/convert", (req, res) => {
  const tempFilePath = `/tmp/${uuidv4()}.xls`;
  fs.writeFileSync(tempFilePath, req.body);

  xlsToJson({ input: tempFilePath, output: null }, (err, result) => {
    fs.unlinkSync(tempFilePath);
    if (err) return res.status(500).json({ error: "Conversion failed", details: err });

    const parser = new Parser();
    const csv = parser.parse(result);

    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  });
});

app.listen(3000, () => console.log("✅ API ready on port 3000"));
