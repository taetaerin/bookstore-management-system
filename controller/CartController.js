import { StatusCodes } from "http-status-codes";
import authUtils from "../utils/authUtils.js";
import CartService from "../services/CartService.js";

const addToCart = async (req, res) => {
    const { bookId, quantity } = req.body;
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res);

        const results = await CartService.insertCartItem(bookId, quantity, authorization.id);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const getCartItems = async (req, res) => {
    const { selected } = req.body;
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res);

        const results = await CartService.getCartList(selected, authorization.id);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const removeCartItem = async (req, res) => {
    const cartItemId = req.params.id;
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res);

        const results = await CartService.deleteCartItem(cartItemId);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { addToCart, getCartItems, removeCartItem };
