import mariadb from "mysql2/promise";
import bcryptUtils from "../utils/bcryptUtils.js";

const createUser = async (email, password) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        const hashedPassword = bcryptUtils.hashPassword(password);

        const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        const values = [email, hashedPassword];
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getUserEmail = async (email) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        const sql = `SELECT * FROM users WHERE email = ?`;

        const [results] = await conn.execute(sql, [email]);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateUserPassword = async (email, password) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        const hashedPassword = bcryptUtils.hashPassword(password);
        const sql = "UPDATE users SET password=? WHERE email=?";
        const values = [hashedPassword, email];
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default { createUser, getUserEmail, updateUserPassword };
