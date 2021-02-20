import express, { Application } from "express";
import { Client } from "pg";
import bcrypt from "bcrypt";
import e from "express";

export default (client: Client): Application => {
  const app = express();

  app.post("/signup", async (req, res) => {
    let name: string = req.body.name ?? "";
    let username: string = req.body.username ?? "";
    let password: string = req.body.password ?? "";
    let bio: string = req.body.bio ?? "";
    let lat: number = 34.0522;
    let long: number = 118.2437;
    let address: string = req.body.address ?? "";
    if (password.length > 5) {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          res.status(500).send("HASH ERROR");
        } else {
          client.query(
            "INSERT INTO Users (username, password, bio, address, name, location) VALUES ($1, $2, $3, $4, $5, ST_GeomFromText('POINT("+lat +" "+long+")')) RETURNING id",
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
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        res.status(500).send("HASH ERROR");
      } else {
        client.query(
          "SELECT id FROM Users WHERE username = $1 AND password = $2",
          [username, hash],
          (dbErr, dbRes) => {
            if (dbErr) {
              res.status(500).send(dbErr);
            } else {
              if (dbRes.rowCount == 0) {
                res.status(401).send("Authentication Failed");
              } else {
                req.session.userID = dbRes.rows[0].id;
                res.status(200).send("Logged In successfully");
              }
            }
          }
        );
      }
    });
  });

  app.post("/deleteaccount", (req, res) => {
    let username = req.body.username;
  });
  return app;
};
