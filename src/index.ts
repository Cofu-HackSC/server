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

  app.listen(port, process.env.IPBIND as string, () => {
    console.log(
      "Cofu running at http://" + process.env.IPBIND + `:${port} ` + Date()
    );
  });
};

start();
