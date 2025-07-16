const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const mongoose = require("mongoose");
const app = require("./app");

const CONNECTION_STRING = process.env.CONNECTION_STRING.replace(
  "password",
  process.env.DB_PASSWORD
);

async function DBConnect() {
  await mongoose
    .connect(CONNECTION_STRING)
    .then(() => {
      console.log("DB connection successful");
    })
    .catch((err) => {
      console.log(err.message);
    });
}
DBConnect();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}`);
});
