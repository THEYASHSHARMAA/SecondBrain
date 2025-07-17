"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserMid = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "dskjw21";
const authUserMid = (req, res, next) => {
    const header = req.headers.token;
    if (!header) {
        res.status(401).json({
            message: "header is empty",
        });
    }
    const decode = jsonwebtoken_1.default.verify(header, JWT_SECRET);
    if (decode) {
        // @ts-ignore
        req.id = decode.id;
        next();
    }
    else {
        res.json({
            message: "wrong authentication",
        });
    }
};
exports.authUserMid = authUserMid;
