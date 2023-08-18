import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { USER_DETAILS_RESET } from "../constants/userConstants";

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

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = Number(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = Number(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = Number(0.1 * cart.itemsPrice);
  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };
  const backHandler = () => {
    history.push("/payment");
  };

  return (
    <>
      <Row>
        <Col>
          <Button
            type="button"
            className="mt-3 mr-3"
            onClick={backHandler}
            variant="secondary"
          >
            Quay lại
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <CheckoutSteps step1 step2 step3 step4 />
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Địa chỉ giao hàng</h2>
              <p>
                <strong>Địa chỉ: </strong>
                {cart.shippingAddress.address}
              </p>
              <p>
                <strong>Tỉnh/ Thành phố: </strong>
                {cart.shippingAddress.city}
              </p>
              <p>
                <strong>Số điện thoại: </strong>
                {cart.shippingAddress.phoneNumber}
              </p>
              <p>
                <strong>Lưu ý: </strong>
                {cart.shippingAddress.note}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Phương thức thanh toán</h2>
              <strong>Phương thức thanh toán: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Sản phẩm</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Không có sản phẩm để đặt hàng!</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
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
                          <Link to={`/product/${item.product}`} />
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
                <h2>ĐƠN HÀNG</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tạm tính:</Col>
                  <Col>{priceVND(cart.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Phí giao hàng:</Col>
                  <Col>{priceVND(cart.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>VAT:</Col>
                  <Col>{priceVND(cart.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tổng tiền</Col>
                  <Col>{priceVND(cart.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  variant="success"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Đặt hàng
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
