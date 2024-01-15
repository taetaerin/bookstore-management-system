import { StatusCodes } from "http-status-codes";
import authUtils from "../utils/authUtils.js";
import LikeService from "../services/LikeService.js";

const addLike = async(req, res) => {
    const bookId = req.params.id;
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res)

        const results = await LikeService.createLike(authorization.id, bookId);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const removeLike = async (req, res) => {
    const bookId = req.params.id;
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res)

        const results = await LikeService.deleteLike(authorization.id, bookId);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { addLike, removeLike };
