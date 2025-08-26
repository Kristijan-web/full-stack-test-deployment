import express from "express";
import handleError from "./controllers/handleError.js";
import userRouter from "./routes/userRouter.js";
import tourRouter from "./routes/tourRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import reviewRouter from "./routes/ReviewRouter.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(handleError);
export default app;
