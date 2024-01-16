import camelcaseKeys from "camelcase-keys";
import createConnection from "../mariadb.js";

const insertCartItem = async (bookId, quantity, userId) => {
    const conn = await createConnection();

    try {
        const sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES(?, ?, ?)";
        const values = [bookId, quantity, userId];
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getCartList = async (selected, userId) => {
    const conn = await createConnection();

    try {
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                    FROM cartItems
                    LEFT JOIN books ON books.id = cartItems.book_id
                    WHERE user_id = ?`;

        const values = [userId];

        if (selected) {
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected);
        }

        const [results] = await conn.query(sql, values);
        return camelcaseKeys(results);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteCartItem = async (cartItemId) => {
    const conn = await createConnection();

    try {
        let sql = `DELETE FROM cartItems WHERE id = ?`;
        const [results] = await conn.query(sql, [cartItemId]);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default { insertCartItem, getCartList, deleteCartItem };
