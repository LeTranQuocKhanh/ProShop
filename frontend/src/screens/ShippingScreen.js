import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber);
  const [note, setNote] = useState(shippingAddress.note);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, phoneNumber, note }));
    history.push("/payment");
  };

  const backHandler = () => {
    history.push("/cart");
  };

  return (
    <>
      <Button
        type="button"
        className="mt-3 mr-3 btn-secondary"
        onClick={backHandler}
      >
        Quay lại
      </Button>
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <Form.Group></Form.Group>
        <h1>Thông tin giao hàng</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label>Địa chỉ (Số nhà, tên đường, huyện, xã,...):</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập địa chỉ giao hàng"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>Tỉnh/ Thành phố:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tỉnh, thành phố"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="postalCode">
            <Form.Label>Số điện thoại:</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="country">
            <Form.Label>Lưu ý khi giao hàng:</Form.Label>
            <Form.Control
              type="  "
              placeholder="Nhập lưu ý giao hàng"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            className="mt-3 ml-3 btn btn-success"
          >
            Tiếp tục thanh toán
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
