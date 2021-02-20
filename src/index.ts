import express from "express";
import { Client } from "pg";

import debug from "./routes/debug";
import auth from "./routes/auth";

const app = express();
const port = 8080;

let start = async () => {
  const client = new Client();
  await client.connect();


  app.use("/", debug());

  app.use("/auth", auth(client));
  
  app.listen(port, "0.0.0.0", () => {
    console.log(`Cofu running at http://0.0.0.0:${port}` + Date());
  });
};


start()
