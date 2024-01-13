import { StatusCodes } from "http-status-codes";
import { getCategories } from "../services/CategoryService.js";

const allCategory = async (req, res) => {
    try {
        const results = await getCategories();
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { allCategory };
