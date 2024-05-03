import express from "express";

// controller
import authController from "../controllers/authController";
import { userValidationRules, validate } from "../middleware/Validators/Validator";
import userController from "../controllers/userController";

const router = express.Router();

router.post("/signup", userValidationRules(), validate, authController.signup);
router.post("/login", authController.login);

//protect
router.use(authController.protect)

router.get("/me",authController.getMe, userController.getUser);
router.get("/:id", userController.getUser);


//Declare router as a userRouter
const userRouter = router;

export = userRouter;
