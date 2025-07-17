"use strict";
//  in npm express library published in js there is no typescript code the library giev an error i.e there is no decleration of file in ts
// but in there is file in @types/index .d.ts  whoch contain the type of all request so we have to instal
// npm i -d  @types/express
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// there are many library which give same error so we have to add same @types/
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const zod_1 = __importDefault(require("zod"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const JWT_SECRET = "dskjw21";
// app.use(express.static());
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.default.object({
        username: zod_1.default.string().min(3).max(10),
        password: zod_1.default.string().min(3).max(12),
    });
    const parsedWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedWithSuccess.error,
        });
    }
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = yield bcrypt_1.default.hash(password, 4);
    try {
        yield db_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.json({
            message: "u r signed up",
        });
    }
    catch (error) {
        console.log("sign up error", error);
        res.status(500).json({
            message: "something went wrong",
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.UserModel.findOne({ username });
    if (!user) {
        // if user not exits it directly return the status and other code of line is terminate
        return res.status(403).json({
            message: "User does not exist",
        });
    }
    const comparePassword = yield bcrypt_1.default.compare(password, user.password); // We use '!' here safely because we just checked `user` is not null
    if (comparePassword) {
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, JWT_SECRET);
        res.json({
            token: token,
        });
    }
    else {
        return res.status(401).json({
            message: "Incorrect password",
        });
    }
}));
app.post("/api/v1/content", middleware_1.authUserMid, (req, res) => {
    const type = req.body.type;
    const link = req.body.link;
    // @ts-ignore
    const userId = req.id;
    db_1.ContentModel.create({
        type,
        link,
        userId,
        tags: [],
    });
    res.json({
        message: "content added",
    });
});
app.get("/api/v1/content", middleware_1.authUserMid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userID = req.id;
    const data = yield db_1.ContentModel.find({ userId: userID }).populate("userId", "username");
    res.json({ data });
}));
app.post("/api/v1/brain/share", (req, res) => { });
app.get("/api/v1/brain/:shareLink", (req, res) => { });
app.listen(9000, () => {
    console.log("app is listen");
});
