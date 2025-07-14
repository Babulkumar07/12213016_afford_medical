import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Log } from "./logger.js"; // uses your logger logic

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/log", async (req, res) => {
  const { stack, level, logPackage, message } = req.body;

  try {
    const result = await Log(stack, level, logPackage, message);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Logger server running on http://localhost:${PORT}`);
});
