const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

    const data = await User.create({
      ...value,
      password: passwordHash,
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
  await User.findByIdAndUpdate(req.user.id, { token: "" });

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

module.exports = { register, login, logout, current, subscription };
