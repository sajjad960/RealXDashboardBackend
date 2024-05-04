import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Product from "../models/productModel";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import factory from "./handleFactory";
import { Op } from "sequelize";

const createProduct = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, sku } = req.body;
    const user_id = req.user.id;

    const user = await User.findOne({
      where: {
        id: user_id,
      },
      attributes: ["id", "name"],
    });

    if (!user) {
      return next(new AppError("User Not Found", 404));
    }

    const fileLinks = [
      {
        usdzFile: {
          usdzFileLink: req.files["usdzFile"]?.[0].location ?? null,
          usdzFileName: req.files["usdzFile"]?.[0].key ?? null,
        },
        glbFile: {
          glbFileLink: req.files["glbFile"]?.[0].location ?? null,
          glbFileName: req.files["glbFile"]?.[0].key ?? null,
        },
      },
    ];
    const posterLink = {
      posterFileLink: req.files["poster"]?.[0].location ?? null,
      posterFileName: req.files["poster"]?.[0].key ?? null,
    };
    const doc = await Product.create({
      name,
      sku,
      user_id,
      models: JSON.stringify(fileLinks),
      poster: JSON.stringify(posterLink),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: {
        ...doc.dataValues,
        user_id: undefined,
        //   userDetailsComment: user,
      },
    });
  }
);

const getAllProducts = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    // add filter
    req.query.user_id = req.user.id;
    req.query.status = {[Op.ne]: 4}
    // get associate data
    //   req.query.include = [{ model: Counter, as: "commentReactions" }, {model: User, as: "userDetailsComment", attributes: ['id', 'name']}];

    // Check If PostId Valid.
    //   const isPostExist = await Post.findOne({
    //     where: {
    //       id: post_id,
    //     },
    //   });
    //   if (!isPostExist) {
    //     return next(new AppError("Post Not Found", 404));
    //   }

    factory.getAll(Product)(req, res, next);
  }
);

const deleteProduct = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const id: string = req.params.id;

    const product = await Product.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!product) {
      return next(new AppError("Product Not Found", 404));
    }

    const doc = await Product.update(
      {
        status: 4,
      },
      {
        where: { id: id, user_id },
      }
    );
    console.log(doc);

    res.status(410).json({
      status: "success",
      message: "Product has been deleted",
    });
  }
);

const productController = { createProduct, getAllProducts, deleteProduct };
export = productController;
