import { StatusCodes } from "http-status-codes";
import BookService from "../services/BookService.js";
import authUtils from "../utils/authUtils.js";
import jwt from "jsonwebtoken";
import conn from "../mariadb.js";

const allBooks = async (req, res) => {
    let allBooksRes = {};
    let { category_id, news, limit, currentPage } = req.query;

    let offset = limit * (currentPage - 1);

  let sql = `SELECT SQL_CALC_FOUND_ROWS *, (SELECT COUNT(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books`;
  let values = [];
  if (category_id && news) {
    sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    values = [category_id];
  } else if (category_id) {
    sql += ` WHERE category_id=?`;
    values = [category_id];
  } else if (news) {
    sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  }

  sql += ` LIMIT ? OFFSET ?`;
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
    }
    console.log(results)
    if (results.length) {
        allBooksRes.books = results
    }else {
        return res.status(StatusCodes.NOT_FOUND).end();
    }
  });

  sql = `SELECT found_rows()`;

  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const pagination = {};
    pagination.currentPage = parseInt(currentPage);
    pagination.totalCount = results[0]["found_rows()"];
    
    allBooksRes.pagination = pagination

    return res.status(StatusCodes.OK).json(allBooksRes);
    
  });
    // try {
    //     const results = await BookService.getBooks(categoryId, news, limit, currentPage);
        
    //     if (results.length) {
    //         return res.status(StatusCodes.OK).json(results);
    //     } else {
    //         return res.status(StatusCodes.NOT_FOUND).end();
    //     }
    // } catch (err) {
    //     console.log(err);
    //     return res.status(StatusCodes.BAD_REQUEST).end();
    // }
};

const bookDetail = async (req, res) => {
    let bookId = req.params.id;
    let authorization = authUtils.ensureAuthorization(req, res);
    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되었습니다. 다시 로그인하세요.",
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰입니다.",
        });
    } else if(authorization instanceof ReferenceError) {
        let bookId = req.params.id;
        const sql = `SELECT *,
                        (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes
                    FROM books 
                    LEFT JOIN category 
                    ON books.category_id = category.category_id  
                    WHERE books.id=?`;
                    const values = [bookId];

                    conn.query(sql, values,
                        (err, results) => {
                            if(err) {
                                console.log(err)
                                return res.status(StatusCodes.BAD_REQUEST).end();
                            }
                            if(results[0]) {
                                return res.status(StatusCodes.OK).json(results[0])
                            }else {
                                return res.status(StatusCodes.NOT_FOUND).end()
                            }
                        });

    }
    else {

        try {
            const results = await BookService.getBookDetail(authorization.id, bookId);
            
            if (results[0]) {
                return res.status(StatusCodes.OK).json(results[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }

};

export { allBooks, bookDetail };
