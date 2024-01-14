import { StatusCodes } from "http-status-codes";
import CategoryService from "../services/CategoryService.js";

const allCategory = async (req, res) => {
    try {
        const results = await CategoryService.getCategories();
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { allCategory };
