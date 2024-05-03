import { NextFunction, Request, Response } from "express"

const catchAsync: Function = (fn : any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
}

export = catchAsync;