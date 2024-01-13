import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.PRIVATE_KEY,
        {
            expiresIn: "5m",
            issuer: "taerin",
        }
    );

    return token
};

export {generateToken}