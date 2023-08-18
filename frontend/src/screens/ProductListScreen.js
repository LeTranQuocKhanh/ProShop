import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

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

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
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
          <Link to="/admin/userlist" className="btn btn-primary my-3">
            Tài khoản
          </Link>{" "}
          <Link to="/admin/orderlist" className="btn btn-primary my-3">
            Đơn hàng
          </Link>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col>
          <h1>
            <strong>Tất cả sản phẩm</strong>
          </h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Tạo sản phẩm mới
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Toast variant="danger">{errorDelete}</Toast>}
      {loadingCreate && <Loader />}
      {errorCreate && (
        <Toast variant="danger">
          Có 1 sản phẩm đã tạo nhưng chưa chỉnh sửa. Vui lòng kiểm tra sản phẩm
          cuối cùng!
        </Toast>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Toast variant="danger">{error}</Toast>
      ) : (
        <>
          <Table striped responsive className="table">
            <thead>
              <tr>
                <th>Mã số</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Thương hiệu</th>
                <th>RAM</th>
                <th>SSD</th>
                <th>Chỉnh sửa thông tin</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{priceVND(product.price)}</td>
                  <td>{product.brand}</td>
                  <td>{product.ram}</td>
                  <td>{product.ssd}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="primary" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>{" "}
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
