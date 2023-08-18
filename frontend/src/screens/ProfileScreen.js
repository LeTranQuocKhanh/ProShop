import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

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

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Nhập lại mật khẩu không đúng");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Chỉnh sửa tài khoản</h2>
        {message && <Toast variant="danger">{message}</Toast>}
        {}
        {success && <Toast variant="success">Cập nhật thành công !</Toast>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Toast variant="danger">{error}</Toast>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Tên tài khoản:</Form.Label>
              <Form.Control
                type="name"
                placeholder="Nhập để thay đổi tên tài khoản"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Địa chỉ Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập để thay đổi địa chỉ Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Đổi mật khẩu mới</Form.Label>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Mật khẩu mới:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập để thay đổi mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Nhập lại mật khẩu mới:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập để xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="success" className="mt-3">
              Cập nhật
            </Button>
          </Form>
        )}
      </Col>
      <Col md={9}>
        <h2>Đơn hàng của tôi</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : orders.length === 0 ? (
          <h1>Bạn chưa có đơn hàng nào!</h1>
        ) : (
          <Table striped responsive className="table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày giao dịch</th>
                <th>Đơn giá</th>
                <th>Trạng thái thanh toán</th>
                <th>Trạng thái giao hàng</th>
                <th>Chi tiết đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{priceVND(order.totalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="primary">
                        Chi tiết
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
