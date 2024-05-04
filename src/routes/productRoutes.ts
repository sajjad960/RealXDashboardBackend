import express from "express";
import upload from "../middleware/upload";
import authController from "../controllers/authController";
import productController from "../controllers/productController";

const router = express.Router();

// router.route("/uploads/:id/:imagename").get(postController.getUploadImages);

router.use(authController.protect);
router.route("/").post(upload, productController.createProduct);
//   .get(postController.getAllPosts);

//Declare router as a userRouter
const productRouter = router;

export = productRouter;
