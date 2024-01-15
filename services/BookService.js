import { StatusCodes } from "http-status-codes";
import mariadb from "mysql2/promise";

const getBooks = async (categoryId, news, limit, currentPage, res) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        let allBooksRes = {};

        const offset = limit * (currentPage - 1);
        let sql = `SELECT SQL_CALC_FOUND_ROWS *, (SELECT COUNT(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books`;
        const values = [];

        if (categoryId && news) {
            sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
            values.push(categoryId);
        } else if (categoryId) {
            sql += ` WHERE category_id=?`;
            values.push(categoryId);
        } else if (news) {
            sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        }

        sql += ` LIMIT ? OFFSET ?`;
        values.push(parseInt(limit), offset);

        console.log('values', values)

        const [booksResults] = await conn.execute(sql, values);

        if(!booksResults.length) {
            return res.status(StatusCodes.NOT_FOUND).end();
        } 

        allBooksRes.books = booksResults;

        const [paginationResults] = await conn.execute(`SELECT found_rows()`);

        const pagination = {
            current_page: parseInt(currentPage),
            total_count: paginationResults[0]["found_rows()"],
        };

        allBooksRes.pagination = pagination;
        console.log('all', allBooksRes)

        return allBooksRes;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getBookDetailForLoginUser = async (userId, bookId) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        const sql = `SELECT *,
                        (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                        (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked 
                    FROM books 
                    LEFT JOIN category 
                    ON books.category_id = category.category_id  
                    WHERE books.id=?`;
        const values = [userId, bookId, bookId];

        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getBookDetailForGuestUser = async (bookId) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        const sql = `SELECT *,
                        (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                    FROM books 
                    LEFT JOIN category 
                    ON books.category_id = category.category_id  
                    WHERE books.id=?`;
        const values = [bookId];

        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default { getBooks, getBookDetailForLoginUser, getBookDetailForGuestUser };
