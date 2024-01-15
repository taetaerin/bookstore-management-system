import { StatusCodes } from "http-status-codes";
import authUtils from "../utils/authUtils.js";
import OrderService from "../services/OrderService.js";

const order = async (req, res) => {
    const authorization = authUtils.ensureAuthorization(req, res);
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    try {
        authUtils.handleAuthError(authorization, res);

        const deliveryResults = await OrderService.insertDeliveryInfo(delivery);
        const deliveryId = deliveryResults.insertId;

        const ordersResults = await OrderService.insertOrdersInfo(
            firstBookTitle,
            totalQuantity,
            totalPrice,
            authorization.id,
            deliveryId
        );
        const orderId = ordersResults.insertId;

        const orderDetailResults = await OrderService.getOrdersDetailInfo(items);

        const values = [];
        orderDetailResults.forEach((item) => {
            values.push([orderId, item.book_id, item.quantity]);
        });

        const orderedBookResults = await OrderService.insertOrderedBookInfo(values);

        let result = await OrderService.deleteCartItems(items);
        return res.status(StatusCodes.OK).json(result);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const getOrders = async (req, res) => {
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res);

        const results = await OrderService.getOrdersInfo();
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const getOrderDetail = async (req, res) => {
    const orderId = req.params.id;
    console.log(orderId)
    const authorization = authUtils.ensureAuthorization(req, res);

    try {
        authUtils.handleAuthError(authorization, res);

        const results = await OrderService.getOrderedBookDetailInfo(orderId);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { order, getOrders, getOrderDetail };
