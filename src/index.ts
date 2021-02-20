import express from "express";
import debug from "./routes/debug";
const app = express();
const port = 8080;

app.use("/", debug());

app.listen(port, "0.0.0.0", () => {
  console.log(`Cofu running at http://0.0.0.0:${port}` + Date());
});
