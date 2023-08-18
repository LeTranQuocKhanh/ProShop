import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import MyVerticallyCenteredModal from "../components/Accrodion";
import Meta from "../components/Meta";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

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

const ProductScreen = ({ history, match }) => {
  const [modalShow, setModalShow] = useState(false);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  // const paragraph = product.description.split("<Enter/>")

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }
    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return (
    <>
      <Link className="btn btn-secondary my-3" to="/">
        Quay lại
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={5}>
              <Image
                src={product.image}
                alt={product.detailName}
                style={{ maxHeight: "400px", maxWidth: "400px" }}
              />
            </Col>
            <Col md={4}>
              <Card className="card border-primary">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>{product.detailName}</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} đánh giá`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item as="h3">
                    <strong>Giá: {priceVND(Number(product.price))}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      variant="primary"
                      onClick={() => setModalShow(true)}
                    >
                      Xem thông tin cấu hình
                    </Button>

                    <MyVerticallyCenteredModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      product={product}
                    />
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="card border-primary">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>
                          Giá tiền: {priceVND(Number(product.price))}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        Trạng thái:{" "}
                        {product.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Số lượng:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block btn btn-success"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h2>Đánh giá sản phẩm</h2>
              {product.reviews.length === 0 && (
                <Message>Sản phẩm chưa được đánh giá!</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Viết đánh giá sản phẩm</h2>
                  {successProductReview && (
                    <Message variant="success">
                      Đánh giá của bạn đã được ghi nhận
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Toast variant="danger">Bạn đã viết đánh giá rồi!</Toast>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Mức độ đánh giá</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="1">1 - Không tốt</option>
                          <option value="2">2 - Tạm được</option>
                          <option value="3" selected>
                            3 - Tốt
                          </option>
                          <option value="4">4 - Hài lòng</option>
                          <option value="5">5 - Rất hài lòng</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Viết nhận xét</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                        className="mt-3"
                      >
                        Gửi đánh giá
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Cần đăng nhập để đánh giá. Bạn có thể
                      <Link to="/login"> đăng nhập</Link> tài khoản tại đây{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={6}>
              <h2>Giới thiệu Laptop:</h2>
              <div className="card border-primary mb-3">
                <div className="card-body">{product.description}</div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
