import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import conn from "../mariadb.js";

dotenv.config();

const addToCart = (req, res) => {
    const { book_id, quantity } = req.body;
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인하세요.",
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다.",
        });
    } else {
        let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES(?, ?, ?);`;
        let values = [book_id, quantity, authorization.id];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.CREATED).json(results);
        });
    }
};

const getCartItems = (req, res) => {
    let { selected } = req.body;
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인하세요.",
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다.",
        });
    } else {
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                        FROM cartItems LEFT JOIN books 
                        ON books.id = cartItems.book_id
                        WHERE user_id = ?  AND cartItems.id IN (?);`;
        let values = [authorization.id, selected];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        });
    }
};

const removeCartItem = (req, res) => {
    let cartItem_id = req.params.id;

    let sql = `DELETE FROM cartItems WHERE id = ?`;
    conn.query(sql, cartItem_id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    });
};

function ensureAuthorization(req, res) {
    try {
        let receivedJwt = req.headers["authorization"];
        let decodedJWT = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        return decodedJWT;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        return err;
    }
}

export { addToCart, getCartItems, removeCartItem };
