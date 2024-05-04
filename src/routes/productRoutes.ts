import express from "express";
import upload from "../middleware/upload";
import authController from "../controllers/authController";
import productController from "../controllers/productController";
import validateUser from "../middleware/validateUser";

const router = express.Router();

// router.route("/uploads/:id/:imagename").get(postController.getUploadImages);

router.use(authController.protect);
router.route("/").post(validateUser, upload, productController.createProduct).get(productController.getAllProducts);
router.route("/:id").delete(productController.deleteProduct)

//Declare router as a userRouter
const productRouter = router;

export = productRouter;
