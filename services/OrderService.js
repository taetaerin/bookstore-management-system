import createConnection from "../mariadb.js";
import camelcaseKeys from "camelcase-keys";

const insertDeliveryInfo = async (delivery) => {
    const conn = await createConnection();

    try {
        const sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
        const values = [delivery.address, delivery.receiver, delivery.contact];
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const insertOrdersInfo = async (firstBookTitle, totalQuantity, totalPrice, userId, deliveryId) => {
    const conn = await createConnection();

    try {
        const sql =
            "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)";
        const values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getOrdersDetailInfo = async (items) => {
    const conn = await createConnection();

    try {
        const sql = "SELECT book_id, quantity FROM cartItems WHERE id IN (?);";
        const [results] = await conn.query(sql, [items]);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const insertOrderedBookInfo = async (values) => {
    const conn = await createConnection();

    try {
        const sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";
        const [results] = await conn.query(sql, [values]);
        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteCartItems = async (items) => {
    const conn = await createConnection();

    try {
        const sql = `DELETE FROM cartItems WHERE id IN (?);`;

        let [result] = await conn.query(sql, [items]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getOrdersInfo = async (userId) => {
    const conn = await createConnection();

    try {
        const sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
                        FROM orders 
                        LEFT JOIN delivery 
                        ON orders.delivery_id = delivery.id
                        WHERE orders.user_id = ?;
                    `;

        let [result] = await conn.execute(sql, [userId]);
        return camelcaseKeys(result);
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const getOrderedBookDetailInfo = async (orderId) => {
    const conn = await createConnection();

    try {
        const sql = `SELECT book_id, title, author, price, quantity
                        FROM orderedBook 
                        LEFT JOIN books
                        ON orderedBook.book_id = books.id
                        WHERE order_id = ?`;

        const [results] = await conn.execute(sql, [orderId]);
        return camelcaseKeys(results);
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export default {
    insertDeliveryInfo,
    insertOrdersInfo,
    getOrdersDetailInfo,
    insertOrderedBookInfo,
    deleteCartItems,
    getOrdersInfo,
    getOrderedBookDetailInfo
};
