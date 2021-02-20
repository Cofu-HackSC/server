import express, { Application } from "express";

export default (): Application => {
  const app = express();

  app.get("/", (_req, res) => {
    res.send("Welcome to Cofu🍴");
  });

  app.get("/status", (_req, res) => {
    res.send("Operational🌟 " + Date());
  });
  
  return app;
};
