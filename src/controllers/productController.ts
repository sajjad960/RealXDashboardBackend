import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Product from "../models/productModel";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import factory from "./handleFactory";
import { Op, Sequelize, where } from "sequelize";
import ProductLog from "../models/productLogModel";
import sequelize from "sequelize";

const createProduct = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, model_placement } = req.body;
    const user_id = req.user.id;
    const url = req.query.url;

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
      url,
      user_id,
      model_placement,
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
    const { product_id, name, model_placement, status } = req.body;
    const url = req.query.url;
    const product = await Product.findOne({
      where: { id: product_id, user_id: req.user.id },
    });
    if (!product) {
      return next(new AppError("Product Not Found", 404));
    }

    //New Updated Link
    const fileNewLinks: any = [{}];
    let posterNewLinks = null;

    if (req.files["usdzFile"]) {
      fileNewLinks[0].usdzFile = {
        usdzFileLink: req.files["usdzFile"]?.[0].location ?? null,
        usdzFileName: req.files["usdzFile"]?.[0].key ?? null,
      };
    } else if (req.files["glbFile"]) {
      fileNewLinks[0].glbFile = {
        glbFileLink: req.files["glbFile"]?.[0].location ?? null,
        glbFileName: req.files["glbFile"]?.[0].key ?? null,
      };
    }

    if (req.files["poster"]) {
      posterNewLinks = {
        posterFileLink: req.files["poster"]?.[0].location ?? null,
        posterFileName: req.files["poster"]?.[0].key ?? null,
      };
    }

    // Old Product Models Link
    const fileOldLinks = JSON.parse(product.models);

    // Update Old Links With New Links
    fileNewLinks.forEach((link1) => {
      Object.keys(link1).forEach((key) => {
        fileOldLinks[0][key] = link1[key];
      });
    });
    // Update New Link To The Product
    if (Object.keys(fileNewLinks[0]).length !== 0) {
      product.models = JSON.stringify(fileOldLinks);
    }
    if (posterNewLinks) {
      product.poster = JSON.stringify(posterNewLinks);
    }
    if (url) {
      product.url = url;
    }
    if (name) {
      product.name = name;
    }
    if (model_placement) {
      product.model_placement = model_placement;
    }
    if (model_placement) {
      product.model_placement = model_placement;
    }
    if (status) {
      product.status = status;
    }
    // Save the Product
    const updatedProduct = await product.save();

    res.status(200).json({
      status: "success",
      message: "Product has been updated",
      product: updatedProduct,
    });
  }
);

const getDashBoardProductDetails = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const user_id = req.user.id;

    const top5ProductQuery = ProductLog.findAll({
      attributes: ["product_views"],
      include: [
        {
          model: Product,
          required: true,
          where: { user_id }, // Filter by user_id = 5
          attributes: ["id", "name", "url", "poster"],
          as: "product_log_details",
        },
      ],
      order: [["product_views", "DESC"]],
      limit: 5,
    });

    // Total Active Products
    const activeProductQuery = Product.count({
      where: {
        status: 1,
        user_id,
      },
    });
    // Total products
    const totalProductsQuery = Product.count({
      where: {
        user_id,
        status: {
          [Op.ne]: 4,
        },
      },
    });

    const [topProducts, activeProductCount, totalProductsCount] =
      await Promise.all([
        top5ProductQuery,
        activeProductQuery,
        totalProductsQuery,
      ]);

    res.status(200).json({
      status: "success",
      topProducts,
      activeProductCount,
      totalProductsCount,
    });
  }
);

const getAllProducts = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    // add filter
    req.query.user_id = req.user.id;
    req.query.status = { [Op.ne]: 4 };
    if (req.query.name && req.query.name.trim() !== "") {
      req.query.name = sequelize.where(
        sequelize.fn("UPPER", sequelize.col("name")),
        "LIKE",
        `%${req.query.name.toUpperCase()}%`
      );
    }
    // get associate data
    req.query.include = [
      {
        model: ProductLog,
        as: "product_log_details",
        attributes: {
          exclude: ["product_id"],
        },
      },
    ];

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

    if (!product) {
      return next(new AppError("Product Not Found", 404));
    }

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
  getDashBoardProductDetails,
};
export = productController;
