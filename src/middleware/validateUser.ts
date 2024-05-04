import { NextFunction, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import AppError from "../utils/AppError";

const validateUser = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const user_id = req.user.id;
    const user = await User.findOne({
      where: {
        id: user_id,
        status: 1,
      },
      attributes: ["id", "name"],
    });

    if (!user) {
      return next(new AppError("User Not Found", 404));
    }

    next();
  }
);

export = validateUser;
