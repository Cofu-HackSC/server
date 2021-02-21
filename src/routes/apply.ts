import { Storage } from "@google-cloud/storage";
import express, { Application } from "express";
import multer from "multer";
import { format } from "util";
import { Client } from "pg";

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

  app.post("/application", upload.single("file"), (req, res) => {
    if (!req.session.userID) {
      res.sendStatus(401);
      return;
    }
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file("licenses/" + req.session.userID + ".jpeg");
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      res.status(501).send(err);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      client.query(
        "INSERT INTO CookApplications (id, cottageFoodLicenseURI, approved) VALUES ($1, $2, $3)",
        [req.session.userID, publicUrl, true],
        (dbErr, dbRes) => {
          if (dbErr) {
            res.status(501).send(dbErr);
          } else {
            res.status(200).send(publicUrl);
          }
        }
      );
    });
  });

  return app;
};
