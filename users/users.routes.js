import express from "express";
import {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  deactivateUser,
  activateUser,
} from "./users.controllers.js";
import { authenticateUser } from "../middleware/authenticate.js";

const userRouter = express.Router();

const app = express();

app.use(
  "/user",
  userRouter

  // #swagger.tags = ["User"]
);

userRouter.use(authenticateUser);
// ROUTES

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getSingleUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

userRouter.patch("/deactivate/:id", deactivateUser);
userRouter.patch("/activate/:id", activateUser);

export default userRouter;
