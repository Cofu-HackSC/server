import express, { Application } from "express";
import { Client } from "pg";

export default (client: Client): Application =>{
    const app = express();

    
    return app;
}