import { Response } from "express";
import catchAsync from "../utils/catchAsync";

const createProduct = catchAsync(async (req: any, res: Response) => {
    const fileUrls = Object.values(req.files).map((file: any) => file.location);
    console.log(req.files);
    res.send('Files uploaded and product saved successfully');
})

const productController = {createProduct};
export = productController;
