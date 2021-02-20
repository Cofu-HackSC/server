import express, { Application } from "express";
import { Client } from "pg";
import bcrypt from "bcrypt";

export default (client: Client): Application => {
  const app = express();

  app.post("/signup", async (req, res) => {
    let username: string = req.body.username ?? "";
    let password: string = req.body.password ?? "";
    let bio: string = req.body.bio ?? "";
    let location: [number, number] = req.body.location;
    let address: string = req.body.address ?? '';
    if (password.length > 5) {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          res.status(500).send('HASH ERROR');
        } else {
            client.query('INSERT INTO Users (username, password, bio, location, address) VALUES ($1, $2, $3, $4) RETURNING id', [username, hash, bio, location, address], (dbErr, dbRes)=>{
                if(dbErr){
                    res.status(500).send(dbErr.toString())
                }else{
                    req.session.userID = dbRes.rows[0]['id']
                    res.status(200).send('succesfully signed up!')
                }
            })
        }
      });
    }else {
        res.status(422).send('Password too short -  must be greater than 5 characters')
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
    let username = req.body.username;
    let password = req.body.password;
    /* TODO:
        1. Check that both username and password are not null
        2. use Bcrypt to hash password
        3. Check password matches
        4. return 202 if succeeded, 500 if failed 

        */
  });

  app.post("/deleteaccount", (req, res) => {
    let username = req.body.username;
  });
  return app;
};
