import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

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

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;

  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  const browseMoreProducts = () => {
    history.push("/");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Giỏ hàng</h1>
        {cartItems.length === 0 ? (
          <Message>
            Giỏ hảng trống! <Link to="/">Bắt đầu mua sắm.</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>{priceVND(item.price)}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>
                Tổng số sản phẩm:{" "}
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </h4>
              {priceVND(
                cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block btn btn-success"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Tiến hành thanh toán
              </Button>
              {cartItems.length === 0 ? (
                ""
              ) : (
                <Button
                  type="button"
                  className="btn-block mb-2 mt-2"
                  onClick={browseMoreProducts}
                >
                  Chọn thêm sản phẩm khác
                </Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
