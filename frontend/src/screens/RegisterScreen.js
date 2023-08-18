import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";

const messageError = {
  "User already exists":
    "Email đã được dùng cho tài khoản khác. Vui lòng thử lại",
  "User validation failed: name: Path `name` is required., email: Path `email` is required., password: Path `password` is required.":
    "Vui lòng nhập đầy đủ các thông tin",
  "User validation failed: email: Path `email` is required., password: Path `password` is required.":
    "Vui lòng nhập thông tin email, mật khẩu và xác nhận mật khẩu",
  "User validation failed: password: Path `password` is required.":
    "Vui lòng nhập mật khẩu và xác nhận mật khẩu",
  "User validation failed: name: Path `name` is required.":
    "Vui lòng nhập tên tài khoản",
  "User validation failed: name: Path `name` is required., email: Path `email` is required.":
    "Vui lòng nhập tên tài khoản và email",
  "User validation failed: name: Path `name` is required., password: Path `password` is required.":
    "Vui lòng nhập tên tài khoản, mật khẩu và xác nhận mật khẩu",
  "User validation failed: email: Path `email` is required.":
    "Vui lòng nhập email",
};

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo } = userRegister;
  let { error } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Nhập lại mật khẩu không chính xác");
      error = "Nhập lại mật khẩu không chính xác";
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <>
      {" "}
      <Link className="btn c my-3 btn-secondary" to="/">
        Quay lại
      </Link>
      <FormContainer>
        <h1>Đăng ký tài khoản</h1>
        {message && (
          <Toast variant="warning" order="1">
            {message}
          </Toast>
        )}
        {error && (
          <Toast variant="danger" order="2">
            {messageError[error]}
          </Toast>
        )}

        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Tên tài khoản: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên tài khoản"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Địa chỉ Email: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập địa chỉ Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Mật khẩu: </Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Nhập lại mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Đăng ký
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Bạn đã có tài khoản?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Đăng nhập tại đây!
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
