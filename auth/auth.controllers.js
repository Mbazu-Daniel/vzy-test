import User from "../users/users.models.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

// Validate register user input
const registerUserSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

// Validate login user input
const loginUserSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const registerUser = asyncHandler(async (req, res) => {
	// Validate request body
	const { error } = registerUserSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ error: error.message });
	}
	try {
		// destructure request body
		const { name, email, password } = req.body;
		const lowercaseEmail = email.toLowerCase();

		const findUser = await User.findOne({ lowercaseEmail });

		if (!findUser) {
			const newUser = await User.create({
				name,
				email: lowercaseEmail,
				password,
			});
			res.status(201).json(newUser);
		} else {
			res.status(400).json({ error: "User already exists" });
		}
	} catch (error) {
		console.error(error);
	}
});

const loginUser = asyncHandler(async (req, res) => {
	// Validate request body
	const { error } = loginUserSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ error: error.message });
	}

	try {
		// destructure request body
		const { email, password } = req.body;

		const lowercaseEmail = email.toLowerCase();

		const user = await User.findOne({ email: lowercaseEmail });

		if (!user) {
			return res.status(404).json("Email or  password not found");
		}
		if (!user.isActive) {
			res.status(404).json("This user is not active!");
		}
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).json("Wrong password or email!");
		}

		const token = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET_TOKEN);

		res
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.status(200)
			.json({ user, access_token: token });
	} catch (err) {
		console.error(err);
	}
});

const logoutUser = asyncHandler((req, res) => {
	res
		.clearCookie("access_token")
		.status(200)
		.json({ message: "Logged out successfully" });
});

export { registerUser, loginUser, logoutUser };
