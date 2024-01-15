import mariadb from "mysql2/promise";
import { StatusCodes } from "http-status-codes";
import authUtils from "../utils/authUtils.js";
import jwt from "jsonwebtoken";

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    let authorization = authUtils.ensureAuthorization(req, res);
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인하세요.",
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다.",
        });
    }
    else {

        const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;
    
        let [results] = await conn.execute(`INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`, [
            delivery.address,
            delivery.receiver,
            delivery.contact,
        ]);
        let delivery_id = results.insertId;
    
        [results] = await conn.execute(
            `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`,
            [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_id]
        );
        let order_id = results.insertId;
    
        //SELECT book_id, quantity FROM catItems WHERE id IN [1, 2, 3];
        let sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?);`;
        let [orderItems, fields] = await conn.query(sql, [items]);
    
        const values = [];
        orderItems.forEach((item) => {
            values.push([order_id, item.book_id, item.quantity]);
        });
    
        results = await conn.query(`INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`, [values]);
    
        let result = await deleteCartItems(conn, items);
        return res.status(StatusCodes.OK).json(result);
    }
};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?);`;

    let result = await conn.query(sql, [items]);
    return result;
};

const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
                FROM orders 
                LEFT JOIN delivery 
                ON orders.delivery_id = delivery.id;`;

    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    const orderId = req.params.id;

    let sql = `SELECT book_id, title, author, price, quantity
                FROM orderedBook 
                LEFT JOIN books
                ON orderedBook.book_id = books.id
                WHERE order_id = ?`;

    let [rows, fields] = await conn.query(sql, orderId);
    return res.status(StatusCodes.OK).json(rows);
};

export { order, getOrders, getOrderDetail };
