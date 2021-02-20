import express, { Application } from "express";
import { Client } from "pg";
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

export default (client: Client): Application =>{
    const app = express();

    app.post('/signup',(req, res)=>{

        let username = req.body.username;
        let password = req.body.password;
        let location = req.body.location;
        console.log('test')
        // console.log(location)
        if (username != null && password != null && location != null) {
            console.log("HEY")
            bcrypt.hash(password, 10, function(err: string, hash: string) {
                res.send(JSON.stringify({password: hash, username: username, location:location}))
                console.log(JSON.stringify({password: hash, username: username}))
                // fetch('https://jsonplaceholder.typicode.com/todos', {
                //     method: 'POST',
                //     body: JSON.stringify({location: location, password: hash, username: username}),
                //     headers: { 'Content-Type': 'application/json' }
                // }).then(res => res.json())
                //     .then(json => console.log(json));
                // Store hash in your password DB.
            });
            // return code
        } else {
            res.send("Username or password was empty.")
        }
        /* TODO:
        1. Check that both username and password are not null
        2. use Bcrypt to hash password
        3. Parse location possibly
        4. store in database
        5. return 202 if succeeded, 500 if failed 
        */
    });
    app.post('/signin',(req, res)=>{
        let username = req.body.username;
        let password = req.body.password;
         /* TODO:
        1. Check that both username and password are not null
        2. use Bcrypt to hash password
        3. Check password matches
        4. return 202 if succeeded, 500 if failed 

        */
    });

    app.post('/deleteaccount',(req, res)=>{
        let username = req.body.username;
    });
    return app;
}