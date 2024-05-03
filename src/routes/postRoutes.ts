import express from "express";
import postController from "../controllers/postController";
import upload from "../middleware/upload";
import authController from "../controllers/authController";

const router = express.Router();

// router.route("/uploads/:id/:imagename").get(postController.getUploadImages);

router.use(authController.protect);
// router
//   .route("/") 
//   .post(upload, postController.createPost)
//   .get(postController.getAllPosts);

//Declare router as a userRouter
const postRouter = router;

export = postRouter;
