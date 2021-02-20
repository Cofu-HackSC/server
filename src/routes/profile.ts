import { application } from "express";
import express, { Application } from "express";
import { Client } from "pg";
import { type } from "os";
export default (client: Client) => {
  const app = express();
  app.get("me", (req, res) => {
    if (req.session.userID != null) {
      res.sendStatus(500);
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
  app.get("@:user_id", (req, res) => {});
};
