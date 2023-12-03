const express = require("express");
const authController = require("../../controllers/auth");
const isAuth = require("../../middlewares/isAuth");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);
router.get("/current", isAuth, authController.current);
router.post("/logout", isAuth, authController.logout);

router.patch("/", isAuth, authController.subscription);
router.patch(
  "/avatars",
  isAuth,
  upload.single("avatar"),
  authController.updateAvatar
);
router.post("/verify", authController.repeatVerifyUser);
router.get("/verify/:verificationToken", authController.verificationUser);
module.exports = router;
