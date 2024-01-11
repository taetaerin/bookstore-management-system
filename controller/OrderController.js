const mariadb = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Library',
        dateStrings: true
    });

    const {items, delivery, totalQuantity, totalPrice ,userId, firstBookTitle} = req.body;

    let [results] = await conn.execute(
        `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`,
        [delivery.address, delivery.receiver, delivery.contact]
    )
    let delivery_id = results.insertId;

    [results] = await conn.execute(
        `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`,
        [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id]
    )
    let order_id = results.insertId;

    //SELECT book_id, quantity FROM catItems WHERE id IN [1, 2, 3];
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?);`
    let [orderItems, fields] = await conn.query(sql, [items])



    let values = []
    orderItems.forEach((item)=> {
        values.push([order_id, item.book_id, item.quantity])
    })

    results = await conn.query(
        `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`,
        [values]
    )

    let result = await deleteCartItems(conn, items);
    return res.status(StatusCodes.OK).json(result);
};


const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?);`

    let result = await conn.query(sql, [items])
    return result
}


const getOrders = (req, res) => {
    res.json('주문 목록 조회');
};

const getOrderDetail = (req, res) => {
    res.json('주문 상세 상품 조회');
}


module.exports = {order, getOrders, getOrderDetail} 