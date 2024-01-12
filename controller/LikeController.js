import conn from "../mariadb.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const addLike = (req, res) => {
    const book_id = req.params.id;
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
        let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (? , ?)`;
        let values = [authorization.id, book_id];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        });
    }
};

const removeLike = (req, res) => {
    const book_id = req.params.id;
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
        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
        let values = [authorization.id, book_id];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        });
    }
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

export { addLike, removeLike };
