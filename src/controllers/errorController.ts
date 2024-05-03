const { UniqueConstraintError } = require('sequelize');
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleDuplicateFieldError = (err) => {
  if (err instanceof UniqueConstraintError) {
    // Extract the duplicate field name from the error message
    const fields = err.fields;
    const duplicateFields = Object.entries(fields)
    .map(([fieldName, value]) => fieldName.split("_")[0]).join(",")
    
    const message = `This ${duplicateFields} already registered.`;

    return new AppError(message, 400)
  }
  
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went rong",
    });
  }
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: any = Object.assign(err);

    if(error?.original?.code === "ER_DUP_ENTRY") error = handleDuplicateFieldError(error)
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
