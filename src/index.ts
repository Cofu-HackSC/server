import dotenv from "dotenv";
dotenv.config();
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

  app.listen(port, process.env.LOCALDEV ? "127.0.0.1" : "0.0.0.0", () => {
    console.log(
      "Cofu running at http://" + process.env.LOCALDEV
        ? "127.0.0.1"
        : "0.0.0.0" + ":${port} " + Date()
    );
  });
};

start();
