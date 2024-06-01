import express from "express";
import validateBody from "../helpers/validateBody.js";
import * as usersControllers from "../controllers/usersControllers.js";
import auth from "../helpers/auth.js";
import upload from "../helpers/upload.js";
import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} from "../schemas/usersSchemas.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(registerSchema),
  usersControllers.register
);

router.post("/login", validateBody(loginSchema), usersControllers.login);

router.post("/logout", auth, usersControllers.logout);

router.get("/current", auth, usersControllers.current);

router.patch(
  "/",
  auth,
  validateBody(subscriptionSchema),
  usersControllers.updateSubscription
);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  usersControllers.changeAvatar
);

export default router;
