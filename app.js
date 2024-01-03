const express = require('express');
const dotenv = require('dotenv').config();
const app = express();


const userRouter = require('./routes/users');
app.use('/users', userRouter);

const bookRouter = require('./routes/books');
app.use('/books', bookRouter);

const cartRouter = require('./routes/carts');
app.use('/carts', cartRouter);

const likeRouter = require('./routes/likes');
app.use('/likes', likeRouter);

const orderRouter = require('./routes/orders');
app.use('/orders', orderRouter);

const categoryRouter = require('./routes/category');
app.use('/category', categoryRouter);

app.listen(process.env.PORT);