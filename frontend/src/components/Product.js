import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

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

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="h6">
          <strong>
            RAM: {product.ram} SSD: {product.ssd}
          </strong>
        </Card.Text>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} đánh giá`}
            color="#f8e825"
          ></Rating>
        </Card.Text>
        <Card.Text as="h5">
          <strike>{priceVND(product.price * 0.15 + product.price)}</strike>
        </Card.Text>
        <Card.Text as="h3">
          <strong>{priceVND(product.price)}</strong>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
