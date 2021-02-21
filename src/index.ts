import dotenv from "dotenv";
dotenv.config();
import express, { application } from "express";
import { Client } from "pg";

import session from "express-session";

import RedisStoreUninitialized from "connect-redis";

import cookieParser from "cookie-parser";
import * as redis from "redis";

const redisClient = redis.createClient(6379, process.env.REDISHOST);
const RedisStore = RedisStoreUninitialized(session);

import debug from "./routes/debug";
import auth from "./routes/auth";
import feed from "./routes/feed";
import profile from "./routes/profile";
import apply from "./routes/apply";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

const port = process.env.PORT ?? 8080;

let start = async () => {
  const client = new Client();
  await client.connect();

  const hour = 60 * 60 * 1000;
  const day = hour * 24;
  const delay = day * 40;

  app.use(
    session({
      secret: "asddd!gds3ag.a4sga,eg2ewg",
      store: new RedisStore({
        client: redisClient,
      }),
      resave: true,
      cookie: {
        maxAge: Date.now() + delay,
      },
    })
  );

  app.use("/", debug());

  app.use("/auth", auth(client));

  app.use("/feeds", feed(client));

  app.use("/", profile(client));
  app.use("/", apply(client));

  app.listen(port, process.env.IPBIND as string, () => {
    console.log(
      "Cofu running at http://" + process.env.IPBIND + `:${port} ` + Date()
    );
  });
};

start();

declare module "express-session" {
  interface Session {
    userID: string;
  }
}
