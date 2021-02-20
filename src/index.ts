import express from "express";
const app = express();
const port = 8080;

app.get("/", (_req, res) => {
  res.send("Welcome to Cofu🍴");
});

app.get("/status", (_req, res) => {
    res.send("Operational🌟 " + Date());
  });
app.listen(port, "0.0.0.0", () => {
  console.log(`Cofu running at http://0.0.0.0:${port}` + Date());
});
