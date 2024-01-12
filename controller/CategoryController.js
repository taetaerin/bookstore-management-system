import { StatusCodes } from "http-status-codes";
import conn from "../mariadb.js";

const allCategory = (req, res) => {
    let sql = `SELECT * FROM category`;
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    });
};

export { allCategory };
