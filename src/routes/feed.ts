import express, { Application } from "express";
import { Client } from "pg";

export default (client: Client): Application => {
  const app: Application = express();
  app.get("/foods", (req, res) => {
    client.query("SELECT * FROM Items", (dbErr, dbRes) => {
      if (dbErr) {
        res.status(500).send(dbErr);
      } else {
        res.status(200).send(dbRes.rows);
      }
    });
  });
  return app;
};
