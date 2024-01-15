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

    return token;
};

const ensureAuthorization = (req, res) => {
    try {
        let receivedJwt = req.headers["authorization"];
        if (receivedJwt) {
            let decodedJWT = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            return decodedJWT;
        } else {
            throw new ReferenceError("jwt must b provided")
        }
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        return err;
    }
};

export default { generateToken, ensureAuthorization };
