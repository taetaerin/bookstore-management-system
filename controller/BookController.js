import { StatusCodes } from "http-status-codes";
import BookService from "../services/BookService.js";
import authUtils from "../utils/authUtils.js";
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
};

const bookDetail = async (req, res) => {
    const bookId = req.params.id;
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res);

        let results;
        if (authorization instanceof ReferenceError) {
            results = await BookService.getBookDetailForGuestUser(bookId);
        } else {
            results = await BookService.getBookDetailForLoginUser(authorization.id, bookId);
        }

        if (results[0]) {
            return res.status(StatusCodes.OK).json(results[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { allBooks, bookDetail };
