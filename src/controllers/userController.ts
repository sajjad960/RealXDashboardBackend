import User from "../models/userModel";
import AppError from "../utils/AppError";
import factory from "./handleFactory";
import { NextFunction, Request, Response } from "express";


// const getUser = factory.getOne(User);
const getUser = (req: any, res: Response, next: NextFunction) => {
    const paramsUserId:number = Number(req?.params?.id);
    const userId: number = req?.user?.id;

    if (userId !== paramsUserId) {
      return next(
        new AppError(
          "Access forbidden",
          401
        )
      );
    }

    const dataFunction = factory.getOne(User, ["password"]);
    return dataFunction(req, res, next)
};

export = {
    getUser
}