import { Types } from "mongoose";
const validateId = (id) => {
	const isValid = Types.ObjectId.isValid(id);
	if (!isValid)
		throw new Error(`This ID ${id} is not a valid MongoDB ID or Not found`);
};
export default validateId;
