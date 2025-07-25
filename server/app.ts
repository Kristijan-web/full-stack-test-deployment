import express from "express";
import handleError from "./controllers/handleError.js";
const app = express();

app.use(handleError);
export default app;
