//  in npm express library published in js there is no typescript code the library giev an error i.e there is no decleration of file in ts
// but in there is file in @types/index .d.ts  whoch contain the type of all request so we have to instal
// npm i -d  @types/express

// there are many library which give same error so we have to add same @types/
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ContentModel, LinkModel, UserModel } from "./db";
import zod from "zod";
import { authUserMid } from "./middleware";
const app = express();
import { random } from "./utils";
const JWT_SECRET = "dskjw21";
// app.use(express.static());

app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {
  const requiredBody = zod.object({
    username: zod.string().min(3).max(10),
    password: zod.string().min(3).max(12),
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
  const hashedPassword = await bcrypt.hash(password, 4);

  try {
    await UserModel.create({
      username: username,
      password: hashedPassword,
    });
    res.json({
      message: "u r signed up",
    });
  } catch (error) {
    console.log("sign up error", error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    // if user not exits it directly return the status and other code of line is terminate
    return res.status(403).json({
      message: "User does not exist",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password!); // We use '!' here safely because we just checked `user` is not null
  if (comparePassword) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  } else {
    return res.status(401).json({
      message: "Incorrect password",
    });
  }
});

app.post("/api/v1/content", authUserMid, (req, res) => {
  const type = req.body.type;
  const link = req.body.link;
  // @ts-ignore
  const userId = req.id;
  ContentModel.create({
    type,
    link,
    userId,
    tags: [],
  });
  res.json({
    message: "content added",
  });
});
app.get("/api/v1/content", authUserMid, async (req, res) => {
  //@ts-ignore
  const userID = req.id;
  const data = await ContentModel.find({ userId: userID }).populate(
    "userId",
    "username"
  );
  res.json({ data });
});
app.delete("/api/v1/content", authUserMid, async (req, res) => {
  const contentID = req.body.contentId;
  await ContentModel.deleteOne({
    contentID,
    //@ts-ignore
    userID: req.userId,
  });

  res.json({ message: "deleted" });
});
app.post("/api/v1/brain/share", authUserMid, async (req, res) => {
  const share = req.body.share;
  try {
    if (share) {
      const existingLink = await LinkModel.findOne({
        //@ts-ignore
        userId: req.id,
      });

      if (existingLink) {
        return res.json({
          hash: existingLink.hash,
        });
      } //if not exists, create one
      const hash = random(10);
      await LinkModel.create({
        //@ts-ignore
        userId: req.id,
        hash,
      });
      res.json({
        msg: "Updated share link",
        hash,
      });
    } else {
      await LinkModel.deleteOne({
        //@ts-ignore
        userId: req.id,
      });
      res.json({
        msg: "Link removed",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hashLink = req.params.shareLink;
  console.log(hashLink);
  const link = await LinkModel.findOne({ hash: hashLink });

  console.log(link);
  if (!link) {
    return res.status(411).json({
      msg: "Invalid link",
    });
  }
  // here we fetch the alll content reltd to that link

  const content = await ContentModel.find({
    userId: link.userId,
  });
  //now we fetch the user detail from userModel for username
  const user = await UserModel.findOne({
    _id: link.userId,
  });
  if (!user) {
    return res.status(411).json({
      msg: "User not found",
    });
  }

  res.json({
    username: user.username,
    content,
  });
});

app.listen(9000, () => {
  console.log("app is listen");
});
