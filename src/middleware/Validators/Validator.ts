import { body, validationResult } from "express-validator";
import { NextFunction } from "express";
import { Request } from "express";
import { Response } from "express";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

const userValidationRules = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("password").trim().notEmpty().withMessage("Password cannot be empty"),
  ];
};
const productValidationRules = () => {
  return [
    body("name")
      .trim().notEmpty()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("url").trim().notEmpty().withMessage("Please enter a valid url"),
  ];
};

const Validator = { userValidationRules, validate, productValidationRules };

export = Validator;
