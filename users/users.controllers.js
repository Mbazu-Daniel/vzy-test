import validateId from "../middleware/validateId.js";
import User from "./users.models.js";
import asyncHandler from "express-async-handler";

const getSingleUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateId(id);
	try {
		const user = await User.findById(id);
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
	}
});
const getAllUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateId(id);
	try {
		await User.findByIdAndDelete(id);
		res.status(204).json("User has been deleted.");
	} catch (error) {
		console.error(error);
	}
});

const updateUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateId(id);
	try {
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true },
		);
		res.status(202).json(updatedUser);
	} catch (error) {
		console.error(error);
	}
});

const blockUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateId(id);

	try {
		const blocked = await User.findByIdAndUpdate(
			id,
			{
				isActive: true,
			},
			{
				new: true,
			},
		);
		res.json(blocked);
	} catch (error) {
		throw new Error(error);
	}
});

const unblockUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateId(id);

	try {
		const unblock = await User.findByIdAndUpdate(
			id,
			{
				isActive: false,
			},
			{
				new: true,
			},
		);
		res.json({
			message: "User UnBlocked",
			unblock,
		});
	} catch (error) {
		throw new Error(error);
	}
});

export {
	getAllUsers,
	getSingleUser,
	deleteUser,
	updateUser,
	blockUser,
	unblockUser,
};
