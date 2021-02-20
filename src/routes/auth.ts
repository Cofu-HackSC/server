import express, { Application } from "express";
import { Client } from "pg";
import bcrypt from "bcrypt";

export default (client: Client): Application => {
  const app = express();

  app.post("/signup", async (req, res) => {
    let name: string = req.body.name ?? "";
    let username: string = req.body.username ?? "";
    let password: string = req.body.password ?? "";
    let bio: string = req.body.bio ?? "";
    let lat: number = req.body.lat;
    let long: number = req.body.long;
    let address: string = req.body.address ?? "";
    if (lat == null || long == null) {
      res.status(400).send("SEND A LAT LONG");
    } else if (password.length > 5) {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          res.status(500).send("HASH ERROR");
        } else {
          client.query(
            "INSERT INTO Users (username, password, bio, address, name, location) VALUES ($1, $2, $3, $4, $5, ST_GeomFromText('POINT(" +
              lat +
              " " +
              long +
              ")')) RETURNING id",
            [username, hash, bio, address, name],
            (dbErr, dbRes) => {
              if (dbErr) {
                res.status(500).send(dbErr.toString());
              } else {
                req.session.userID = dbRes.rows[0]["id"];
                res.status(200).send("succesfully signed up!");
              }
            }
          );
        }
      });
    } else {
      res
        .status(422)
        .send("Password too short -  must be greater than 5 characters");
    }
  });
  app.post("/signin", (req, res) => {
    let username: string = req.body.username;
    let password: string = req.body.password;
    client.query(
      "SELECT id, password FROM Users WHERE username = $1 AND password = $2",
      [username, password],
      (dbErr, dbRes) => {
        if (dbErr) {
          res.status(500).send(dbErr);
        } else {
          if (dbRes.rowCount == 0) {
            res.status(500).send("Authentication Failed DB");
          } else {
            let match: boolean = bcrypt.compareSync(
              password,
              dbRes.rows[0].password
            );
            if (match) {
              req.session.userID = dbRes.rows[0].id;
              res.status(200).send("Logged In successfully");
            } else {
              res.status(401).send("Authentication Failed");
            }
          }
        }
      }
    );
  });

  app.post("/deleteaccount", (req, res) => {
    let username = req.body.username;
  });
  return app;
};
