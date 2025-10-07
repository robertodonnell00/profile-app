// index.js
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import usersRouter from "./api/users/index.js";
import defaultErrHandler from "./errHandler/index.js";
import "./db/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/accounts", usersRouter);

// serve index.html from project root inside container
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// dynamic profile picture using env IMAGE (e.g., profile-2)
app.get("/profile-picture", (req, res) => {
  const base = (process.env.IMAGE || "profile-1").replace(/[^a-zA-Z0-9_-]/g, "");
  const candidates = [`${base}.jpg`, `${base}.jpeg`, `${base}.png`, `${base}.webp`];

  let file = "profile-1.jpg";
  for (const name of candidates) {
    const p = path.join(__dirname, "images", name);
    if (fs.existsSync(p)) {
      file = name;
      break;
    }
  }

  res.set("Cache-Control", "no-store");               // avoid stale cache
  res.type(path.extname(file));                       // proper Content-Type
  res.sendFile(path.join(__dirname, "images", file));
});

app.use(defaultErrHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
