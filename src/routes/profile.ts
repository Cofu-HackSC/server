import express, { Application } from "express";
import { Client } from "pg";
export default (client: Client): Application => {
  const app = express();
  app.get("/me", (req, res) => {
    if (req.session.userID != null) {
      res.status(500).send("SEND YOUR SESSION");
    } else {
      client.query(
        "SELECT * FROM Users WHERE id = $1 LIMIT 1",
        [req.session.userID],
        (dbErr, dbRes) => {
          if (dbErr) {
            res.status(500).send(dbErr);
          } else {
            res.send(dbRes.rows);
          }
        }
      );
    }
  });
  app.get("@:username", (req, res) => {
    if (req.session.userID != null) {
        res.status(500).send("SEND YOUR SESSION");
    } else {
      client.query(
        "SELECT * FROM Users WHERE username = $1 LIMIT 1",
        [req.params.username],
        (dbErr, dbRes) => {
          if (dbErr) {
            res.status(500).send(dbErr);
          } else {
            res.send(dbRes.rows);
          }
        }
      );
    }
  });

  return app;
};
