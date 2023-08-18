import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser } from "../actions/userActions";

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Bạn có chắc sẽ xóa tài khoản này không ?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <Row>
        <Col md={9}>
          <Link to="/" className="btn btn-secondary my-3">
            Quay lại
          </Link>
        </Col>
        <Col md={3}>
          <Link to="/admin/productlist" className="btn btn-primary my-3">
            Sản phẩm
          </Link>{" "}
          <Link to="/admin/orderlist" className="btn btn-primary my-3">
            Đơn hàng
          </Link>
        </Col>
      </Row>

      <h1>
        <strong>Tất cả tài khoản</strong>
      </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped responsive className="table">
          <thead>
            <tr>
              <th>Mã tài khoản</th>
              <th>Tên tài khoản</th>
              <th>Địa chỉ email</th>
              <th>Tài khoản admin?</th>
              <th>Chỉnh sửa tài khoản</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="primary" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  {"    "}
                  <Button
                    variant="danger"
                    className="btn"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
