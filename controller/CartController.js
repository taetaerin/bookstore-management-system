const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');


const addToCart = (req, res) => {
    const {book_id, quantity, user_id} = req.body;
    
    let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES(?, ?, ?);`;
    let values = [book_id, quantity, user_id];
    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        
            return res.status(StatusCodes.CREATED).json(results);
        }
    )
};

const getCartItems = (req, res) => {
    let {user_id} = req.body;
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                    FROM cartItems LEFT JOIN books 
                    ON books.id = cartItems.book_id
                    WHERE user_id = ?;`;
    conn.query(sql, user_id,
        (err, results) => {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        
            return res.status(StatusCodes.OK).json(results);
            
        }
    )
};

const removeCartItem= (req, res) => {
    res.json('장바구니 개별 삭제');
};



module.exports = {addToCart, getCartItems, removeCartItem};