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
    if (req.session.userID == null) {
      res.status(400).send("Auth failed");
      return;
    }
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file("licences/" + req.session.userID + ".jpeg");
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
        "INSERT INTO CookApplications (id, cottageFoodLicenseURI, approved) VALUES ($1, $2, True)",
        [req.session.userID, publicUrl]
      );
      client.query(
        "UPDATE Users SET isCook = TRUE WHERE id = $1",
        [req.session.userID],
        (dbErr, dbRes) => {
          if (dbErr) {
            res.status(501).send("DB ERROR MY MAN");
          } else {
            res.sendStatus(200);
          }
        }
      );
      // The public URL can be used to directly access the file via HTTP.

      res.status(200).send(publicUrl);
    });

    blobStream.end(req.file.buffer);
  });

  return app;
};
