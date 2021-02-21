import express, { Application } from "express";
import { Client } from "pg";

export default (client: Client): Application => {
  const app: Application = express();
  app.get("/foods", (req, res) => {
    client.query(
      " SELECT Users.*, Users.photoURL as profileImage, Users.name as userdisplayname, Items.* FROM Items INNER JOIN Users ON Users.id = Items.sellerID",
      (dbErr, dbRes) => {
        if (dbErr) {
          res.status(500).send(dbErr);
        } else {
          res.status(200).send(dbRes.rows);
        }
      }
    );
  });

  app.get("/search", (req, res) => {
    let search: string = req.body;
    client.query(
      " SELECT Users.*, Users.photoURL as profileImage, Users.name as userdisplayname, Items.*  FROM Items INNER JOIN Users ON Users.id = Items.sellerID  WHERE $1 IN (Items.name, Items.description, Items.ingredients)",
      [search],
      (dbErr, dbRes) => {
        if (dbErr) {
          res.status(500).send(dbErr);
        } else {
          res.status(200).send(dbRes.rows);
        }
      }
    );
  });

  return app;
};
