import express, { NextFunction, Request, Response } from "express";
const app = express();
import bodyParser from "body-parser";

//Security packages
import cors from "cors";

import AppError from "./utils/AppError";
import globalErrorHandler from "./controllers/errorController";
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";

// cors security
app.use(
  cors({
    origin: "*",
  })
);
// Parse Body
// app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Test Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("hello from middleware");
  next();
});

// app.use("/uploads/:username", express.static(path.join(__dirname, './files/image')));

//Routes
const prefix = "/api/v1";

app.use(`${prefix}/users`, userRouter);
app.use(`${prefix}/posts`, postRouter);


//If app not found any api route
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//handling global error
app.use(globalErrorHandler);

export default app;
