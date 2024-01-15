import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const generateToken = (user) => {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.PRIVATE_KEY,
        {
            expiresIn: "1m",
            issuer: "taerin",
        }
    );

    return token;
};

const ensureAuthorization = (req, res) => {
    try {
        let receivedJwt = req.headers["authorization"];
        if (!receivedJwt) throw new ReferenceError("jwt must be provided");

        let decodedJWT = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        return decodedJWT;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        return err;
    }
};

const handleAuthError = (authorization, res) => {
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인하세요.",
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다.",
        });
    }
};

export default { generateToken, ensureAuthorization, handleAuthError };
