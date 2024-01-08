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
    //강사님 코드
    // let {user_id, selected} = req.body;

    // let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
    //                 FROM cartItems LEFT JOIN books 
    //                 ON books.id = cartItems.book_id
    //                 WHERE user_id = ?  AND cartItems.id IN (?);`;
    // let values = [user_id, selected]
    // conn.query(sql, values,
    //     (err, results) => {
    //         if(err) {
    //             console.log(err)
    //             return res.status(StatusCodes.BAD_REQUEST).end();
    //         }
        
    //         return res.status(StatusCodes.OK).json(results);
            
    //     }
    // )


    //내가 수정한 코드
    let {user_id, selected} = req.body;
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON books.id = cartItems.book_id
                `
    let values = []
    
    if(user_id && selected) {
        sql += ` WHERE user_id = ? AND cartItems.id IN (?)`
        values.push(user_id, selected)
    }

    else if(user_id) {
        sql += ` WHERE user_id = ?`
        values.push(user_id)
    }
    conn.query(sql, values,
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
    let {id} = req.params;

    let sql = `DELETE FROM cartItems WHERE id = ?`;
    conn.query(sql, id,
        (err, results) => {
            if(err) {
                console.log(err)
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        
            return res.status(StatusCodes.OK).json(results);
            
        }
    )
};



module.exports = {addToCart, getCartItems, removeCartItem};