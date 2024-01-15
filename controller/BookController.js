import { StatusCodes } from "http-status-codes";
import BookService from "../services/BookService.js";
import authUtils from "../utils/authUtils.js";

const allBooks = async (req, res) => {
    const { categoryId, news, limit, currentPage } = req.query;

    try {
        const results = await BookService.getBooks(categoryId, news, limit, currentPage, res);

        return res.status(StatusCodes.OK).json(results);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const bookDetail = async (req, res) => {
    const bookId = req.params.id;
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res);

        let results;
        if (authorization instanceof ReferenceError) {
            results = await BookService.getBookDetailForGuestUser(bookId);
        } else {
            results = await BookService.getBookDetailForLoginUser(authorization.id, bookId);
        }

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
