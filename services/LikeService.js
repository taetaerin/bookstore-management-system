import createConnection from "../mariadb.js";

const insertLike = async (userId, bookId) => {
    const conn = await createConnection();

    try {
        const sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (? , ?)";
        const values = [userId, bookId];
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteLike = async (userId, bookId) => {
    const conn = await createConnection();

    try {
        const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";
        const values = [userId, bookId];
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default { insertLike, deleteLike };
