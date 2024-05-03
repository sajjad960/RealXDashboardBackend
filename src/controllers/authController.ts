import Users from "../models/userModel";
import jwt, { SignCallback } from "jsonwebtoken";
import AppError from "../utils/AppError";
import { promisify } from "util";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

type userDetails = {
  id: number;
  name: string;
  password: string;
  passwordResetExpires: any;
  passwordResetToken: any;
};
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

const getMe = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  req.params.id = req.user.id;
  next();
};

const signToken = (id: number) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: userDetails,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id);

  // Remove some feild from output
  (user.password = undefined),
    (user.passwordResetExpires = undefined),
    (user.passwordResetToken = undefined);

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, address, username, password } = req.body;

    const hasedPassword = await bcrypt.hash(password, 12);

    const body = {
      name,
      email,
      address,
      username,
      password: hasedPassword,
    };
    // create user
    const newUser = await Users.create(body);

    // create token,
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // check if user exist && password is correct
    const user: any = await Users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new AppError("Incorrect email or password", 403));
    }

    // check password
    const checkPassword = await bcrypt.compare(password, user?.password);
    if (!checkPassword) {
      return next(new AppError("Incorrect email or password", 403));
    }

    // if everything ok, send token to client
    createSendToken(user, 201, req, res);
  } catch (err) {
    next(err);
  }
};

const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Getting token and check of it's there
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not log in! Please log in to get access", 401)
      );
    }
    // Verification token
    let jwtInharitance: any = jwt;
    const decoded: any = await promisify(jwtInharitance.verify)(
      token,
      process.env.JWT_SECRET
    );
    // Check if user still exists
    const currentUser = await Users.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does not longer exist",
          401
        )
      );
    }
    // // Check if user changed password after the token was issued.
    // if(currentUser.changedPasswordAfter(decoded.iat)) {
    //     return next(new AppError('User recently change password. Please log in again', 400))
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

const authController = {
  login,
  signup,
  protect,
  getMe,
};

export = authController;
