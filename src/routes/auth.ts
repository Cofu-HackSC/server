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
    let location: [number, number] = req.body.location;
    let address: string = req.body.address ?? "";
    if (password.length > 5) {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          res.status(500).send("HASH ERROR");
        } else {
          client.query(
            "INSERT INTO Users (username, password, bio, location, address, name) VALUES ($1, $2,ST_GeomFromText('POINT($3 $4))', $5, $6) RETURNING id",
            [username, hash, bio, location[0], location[1], address],
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
    /* TODO:
        1. Check that both username and password are not null
        2. use Bcrypt to hash password
        3. Parse location possibly
        4. store in database
        5. return 202 if succeeded, 500 if failed 
        */
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
