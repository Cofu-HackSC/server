import { Storage } from "@google-cloud/storage";
import express, { Application } from "express";
import multer from "multer";
import { Client } from "pg";
import { format } from "util";
export default (client: Client): Application => {
  const app = express();
  const storage = new Storage();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // no larger than 10mb, you can change as needed.
    },
  });

  const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET as string);

  app.post("/item", upload.single("file"), (req, res) => {
    if (!req.session.userID) {
      res.sendStatus(403);
    } else {
      let name: string = req.body.name;
      let pickup: string = req.body.pickup;
      let delivery: string = req.body.delivery;
      let cost: string = req.body.cost;
      let description: string = req.body.description;
      let ingredients: string = req.body.ingredients;
      let stock: string = req.body.stock;
      const blob = bucket.file("items/" + req.session.userID+(Date()+1).toString() + ".jpeg");
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.log(err);
        res.status(501).send(err);
      });

      blobStream.on("finish", () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        client.query(
          "INSERT INTO Items (sellerID, cost, name, stock, photoUrl, ingredients, description, delivery, pickup) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
          [
            req.session.userID,
            cost,
            stock,
            publicUrl,
            ingredients,
            description,
            delivery,
            pickup,
          ],
          (dbErr, dbRes) => {
            if (dbErr) {
              res.status(499).send(dbErr);
            } else {
              res.status(200).send(dbRes);
            }
          }
        );
      });
    }
  });
  return app;
};
