import { StatusCodes } from "http-status-codes";
import { getBooks, getBookDetail } from "../services/BookService.js";

const allBooks = async (req, res) => {
    let { categoryId, news, limit, currentPage } = req.query;

    try {
        const results = await getBooks(categoryId, news, limit, currentPage);
        
        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const bookDetail = async (req, res) => {
    let bookId = req.params.id;
    let { userId } = req.body;

    try {
        const results = await getBookDetail(userId, bookId);
        
        if (results[0]) {
            return res.status(StatusCodes.OK).json(results[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { allBooks, bookDetail };
