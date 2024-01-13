import mariadb from "mysql2/promise";

const getBooks = async (categoryId, news, limit, currentPage) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        let offset = limit * (currentPage - 1);

        let sql = `SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books`;
        let values = [];

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

        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getBookDetail = async (userId, bookId) => {
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

export { getBooks, getBookDetail };
