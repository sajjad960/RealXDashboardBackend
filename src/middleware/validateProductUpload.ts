import { NextFunction, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import Product from "../models/productModel";

const validateProductUpload = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const user_id = req.user.id;
    const url = req.query.url;
    const routeUrl = req.route.path;
    //validate user
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
    // validate product url
    if(url.trim() === "" && routeUrl !== "/update") {
      return next(new AppError("URL cannot be empty", 400));

    }
    if (url) {
      const product = await Product.findOne({
        where: {
          url,
          user_id,
        },
      });

      if (product) {
        return next(new AppError("Url needs to be unique", 400));
      }
    }

    next();
  }
);

export = validateProductUpload;
