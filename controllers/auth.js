const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const Jimp = require("jimp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const User = require("../models/users");
const schema = require("../schemas/usersSchema");

const register = async (req, res, next) => {
  try {
    const { error, value } = schema.authSchema.validate(req.body);
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = value;

    const isUser = await User.findOne({ email }).exec();

    if (isUser !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const data = await User.create({
      ...value,
      password: passwordHash,
      avatarURL,
    });

    res
      .status(201)
      .json({ user: { email: data.email, subscription: data.subscription } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { error, value } = schema.authSchema.validate(req.body);

  if (typeof error !== "undefined") {
    return res.status(400).json({ message: error.message });
  }

  const { email, password } = value;
  const isUser = await User.findOne({ email }).exec();

  if (isUser === null) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const passwordCompare = await bcrypt.compare(password, isUser.password);

  if (passwordCompare === false) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ id: isUser._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  await User.findByIdAndUpdate(isUser._id, { token }).exec();

  res.json({
    token,
    user: {
      email: isUser.email,
      subscription: isUser.subscription,
    },
  });
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });

  res.status(204).end();
};

const subscription = async (req, res, next) => {
  const { error, value } = schema.subscriptionSchema.validate(req.body);
  if (typeof error !== "undefined") {
    return res.status(400).json({ message: error.message });
  }
  const { subscription } = value;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true }
  );

  res.json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
const updateAvatar = async (req, res, next) => {
  const { error } = schema.updateAvatarSchema.validate(req.body);
  if (typeof error !== "undefined") {
    return res.status(400).json({ message: error.message });
  }

  try {
    const avatars = await Jimp.read(req.file.path);
    avatars.resize(250, 250).write(req.file.path);

    const newFilename = `${crypto.randomUUID()}_${req.file.originalname}`;
    await fs.rename(
      req.file.path,
      path.join(__dirname, "../", "public", "avatars", newFilename)
    );
    const avatarURL = path.join("avatars", newFilename);
    await User.findByIdAndUpdate(
      req.user._id,
      {
        avatarURL,
      },
      { new: true }
    );

    res.json({
      user: {
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  current,
  subscription,
  updateAvatar,
};
