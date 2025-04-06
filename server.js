import cors from "cors";
import express from "express";
const PORT = 3000;
const app = express();

app.use("/", express.static("public"));

app.use(cors());

app.get("/", function (req, res) {
  res.render("index", { NODE_ENV: process.env.NODE_ENV });
});

app.use(function (err, req, res, next) {
  const code = err.code || 500;
  res.status(code).json({ result: false, detail: err.message });
});

app.listen(PORT, function () {
  console.log(`app listening on port ${PORT}!`);
});
