import express, { Application } from "express";
import { Client } from "pg";

export default (client: Client): Application =>{
    const app = express();

    app.post('/signup',(req, res)=>{
        let username = req.body.username;
        let password = req.body.password;
        let location = req.body.location;
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