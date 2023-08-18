import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const tile = 2318000;

// Convert price VND
const priceVND = (num) => {
  let stringNum = num.toString();
  let strNum = stringNum.split("").reverse();
  let result = "";
  for (let i = 0; i < strNum.length; i++) {
    if (i === 2) {
      result += strNum[i] + ".";
    } else if (strNum.length <= 5 && i === 5) {
      result += strNum[i];
    } else if (strNum.length > 5 && i === 5) {
      result += strNum[i] + ".";
    } else {
      result += strNum[i];
    }
  }
  return result.split("").reverse().join("") + "₫";
};

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = Number(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const codPaymentHandler = () => {
    const paymentResult = {
      id: order.id,
      status: "INTERNT",
      update_time: Date.now(),
      payer: {
        email_address: userInfo.email,
      },
    };
    dispatch(payOrder(orderId, paymentResult));
  };

  const backHandler = () => {
    userInfo.isAdmin
      ? history.push("/admin/orderlist")
      : history.push("/profile");
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Button
        type="button"
        className="mt-3 mr-3"
        onClick={backHandler}
        variant="secondary"
      >
        Quay lại
      </Button>
      <h1>Đơn hàng {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Thông tin giao hàng</h2>
              <p>
                <strong>Tên người nhận: </strong> {order.user.name}
              </p>
              <p>
                <strong>Địa chỉ Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>

              <p>
                <strong>Địa chỉ giao hàng: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {order.shippingAddress.phoneNumber}
              </p>
              <p>
                <strong>Lưu ý khi giao hàng:</strong>{" "}
                {order.shippingAddress.note}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Đã giao hàng lúc: {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Chưa giao hàng</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Phương thức thanh toán</h2>
              <p>
                {order.paymentMethod === "COD" ? (
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                ) : (
                  <strong>Thanh toán qua PayPal</strong>
                )}
              </p>
              {order.paymentMethod === "COD" && !order.isPaid ? (
                <Message variant="warning" className="alert alert-warning">
                  Vui lòng thanh toán khi nhận hàng!
                </Message>
              ) : order.isPaid ? (
                <Message variant="success">
                  Đã thanh toán vào lúc: {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Chưa thanh toán</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Sản phẩm đã mua</h2>
              {order.orderItems.length === 0 ? (
                <Message>Không có đơn hàng</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {priceVND(item.price)} ={" "}
                          {priceVND(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Tổng kết đơn hàng</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tạm tính: </Col>
                  <Col>{priceVND(order.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Phí giao hàng: </Col>
                  <Col>{priceVND(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>VAT: </Col>
                  <Col>{priceVND(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Thành tiền: </Col>
                  <Col>{priceVND(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && order.paymentMethod === "PayPal" && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={(
                        Math.round((order.totalPrice / tile) * 100) / 100
                      ).toFixed(2)}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}

              {userInfo &&
                userInfo.isAdmin &&
                !order.isPaid &&
                order.paymentMethod == "COD" && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={codPaymentHandler}
                    >
                      Xác nhận đơn hàng COD
                    </Button>
                  </ListGroup.Item>
                )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Xác nhận đơn hàng đã giao
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
