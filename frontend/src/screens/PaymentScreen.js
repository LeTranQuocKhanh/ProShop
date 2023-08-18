import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  const backHandler = () => {
    history.push("/shipping");
  };

  return (
    <>
      {" "}
      <Button
        type="button"
        className="mt-3 mr-3"
        onClick={backHandler}
        variant="secondary"
      >
        Quay lại
      </Button>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />

        <h1>Phương thức thanh toán</h1>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label as="legend">
                  Chọn phương thức thanh toán:
                </Form.Label>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check
                type="radio"
                label="Thanh toán khi nhận hàng"
                id="COD"
                name="paymentMethod"
                value="COD"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
            <Col>
              <Form.Check
                type="radio"
                label="PayPal or Credit Card"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Row>

          <Button type="submit" variant="success" className="mt-3">
            Tiếp tục đặt hàng
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
