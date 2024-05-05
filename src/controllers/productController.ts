import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Product from "../models/productModel";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import factory from "./handleFactory";
import { Op, Sequelize, where } from "sequelize";
import ProductLog from "../models/productLogModel";

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

const updateProduct = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { product_id } = req.body;
    const product = await Product.findOne({
      where: { id: product_id, user_id: req.user.id },
    });
    // const fileLinks = [
    //   {
    //     usdzFile: {
    //       usdzFileLink: req.files["usdzFile"]?.[0].location ?? null,
    //       usdzFileName: req.files["usdzFile"]?.[0].key ?? null,
    //     },
    //     glbFile: {
    //       glbFileLink: req.files["glbFile"]?.[0].location ?? null,
    //       glbFileName: req.files["glbFile"]?.[0].key ?? null,
    //     },
    //   },
    // ];
    // const posterLink = {
    //   posterFileLink: req.files["poster"]?.[0].location ?? null,
    //   posterFileName: req.files["poster"]?.[0].key ?? null,
    // };
    const fileUpdatedLinks: any = [{}];
    let posterUpdatedLinks;

    if (req.files["usdzFile"]) {
      fileUpdatedLinks[0].usdzFile = {
        usdzFileLink: req.files["usdzFile"]?.[0].location ?? null,
        usdzFileName: req.files["usdzFile"]?.[0].key ?? null,
      };
    } else if (req.files["glbFile"]) {
      fileUpdatedLinks[0].glbFile = {
        glbFileLink: req.files["glbFile"]?.[0].location ?? null,
        glbFileName: req.files["glbFile"]?.[0].key ?? null,
      };
    }

    if (req.files["poster"]) {
      posterUpdatedLinks = {
        posterFileLink: req.files["poster"]?.[0].location ?? null,
        posterFileName: req.files["poster"]?.[0].key ?? null,
      };
    }
    console.log(fileUpdatedLinks, posterUpdatedLinks);
    res.send("file uploaded");
  }
);

const getDashBoardProductDetails = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {}
);

const getAllProducts = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    // add filter
    req.query.user_id = req.user.id;
    req.query.status = { [Op.ne]: 4 };
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

const getProduct = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const url = req?.params?.url;
    const user_id = req?.params?.user_id;
    const product = await Product.findOne({
      where: {
        url,
        user_id,
        status: 1,
      },
      attributes: { exclude: ["status", "user_id"] },
    });

    //add  view count to the log model
    const ifLogIsAlreadyCreated = await ProductLog.findOne({
      where: {
        product_id: product?.id,
      },
    });
    if (ifLogIsAlreadyCreated) {
      // If a log already exists, update its count
      await ProductLog.update(
        { product_views: Sequelize.literal("product_views + 1") },
        {
          where: {
            product_id: product.id,
          },
        }
      );
    } else {
      // If a log doesn't exist, create a new log entry
      await ProductLog.create({
        product_id: product.id,
        product_views: 1, // Set product_views to 1 for the first view
      });
    }

    // send responce
    res.status(200).json({
      status: "success",
      product: product,
    });
  }
);

const productController = {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProduct,
};
export = productController;
