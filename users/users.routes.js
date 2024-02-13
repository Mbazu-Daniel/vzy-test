import express from "express";
import {
	getAllUsers,
	getSingleUser,
	deleteUser,
	updateUser,
	blockUser,
	unblockUser,
} from "./users.controllers.js";
// import { verifyUser, verifyLogin } from "../middleware/verifyToken.js";
const userRouter = express.Router();

// ROUTES

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getSingleUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

userRouter.patch("/block/:id", blockUser);
userRouter.patch("/unblock/:id", unblockUser);

export default userRouter;
