"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
// import { Schema } from './../node_modules/mongoose/types/index.d';
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = __importStar(require("mongoose"));
mongoose_2.default.connect("mongodb://localhost:27017/brainly");
const userSchema = new mongoose_2.Schema({
    username: { type: String, unique: true },
    password: { type: String, unique: true },
});
// const UserModel = new Model(userSchema, "user");
// with previous one it didnt give the the tpe in index.ts so we have to use this
const UserModel = (0, mongoose_2.model)("User", userSchema);
exports.UserModel = UserModel;
const ContentSchema = new mongoose_2.Schema({
    type: String,
    link: String,
    tag: { type: mongoose_1.default.Types.ObjectId, ref: "Tag" },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
});
const ContentModel = (0, mongoose_2.model)("Content", ContentSchema);
exports.ContentModel = ContentModel;
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
});
const LinkModel = (0, mongoose_2.model)("Link", linkSchema);
exports.LinkModel = LinkModel;
