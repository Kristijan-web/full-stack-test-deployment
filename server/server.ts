import dotenv from "dotenv";

dotenv.config({
  path: "./config.env",
});

import mongoose from "mongoose";
import app from "./app.js";

if (!process.env.CONNECTION_STRING || !process.env.DB_PASSWORD) {
  console.log(
    "Missing connection string and password. Server shutting down..."
  );
  process.exit(1);
}

const CONNECTION_STRING = process.env.CONNECTION_STRING.replace(
  "DB_PASSWORD",
  process.env.DB_PASSWORD
);

mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("Problem with connecting to database, " + err);
  });

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log("Listening for requests on port 3000");
});
