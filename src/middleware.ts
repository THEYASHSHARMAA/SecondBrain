import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = "dskjw21";

export const authUserMid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.token;
  if (!header) {
    res.status(401).json({
      message: "header is empty",
    });
  }
  const decode = jwt.verify(header as string, JWT_SECRET);
  if (decode) {
    // @ts-ignore
    req.id = decode.id;
    next();
  } else {
    res.json({
      message: "wrong authentication",
    });
  }
};
