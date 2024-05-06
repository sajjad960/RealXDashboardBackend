import express from "express";
import upload from "../middleware/upload";
import authController from "../controllers/authController";
import productController from "../controllers/productController";
import validateProductUpload from "../middleware/validateProductUpload";

const router = express.Router();

router.route("/public-product/:user_id/:url").get(productController.getProduct);

router.use(authController.protect);
router
  .route("/")
  .post(validateProductUpload, upload, productController.createProduct)
  .get(productController.getAllProducts);

router.route("/dashboard-details").get(productController.getDashBoardProductDetails)

router.route("/update").post(validateProductUpload, upload, productController.updateProduct);

router.route("/:id").delete(productController.deleteProduct);

//Declare router as a userRouter
const productRouter = router;

export = productRouter;
