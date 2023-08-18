import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/test");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline className="d-flex me-auto">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Bạn cần tìm gì ?"
        className="mr-sm-2 ml-sm-5"
        style={{ borderRadius: "80px" }}
      ></Form.Control>
      <Button
        type="submit"
        variant="outline-success"
        className="p-2"
        style={{ border: "none", borderRadius: "80px" }}
      >
        <i className="fas fa-search"></i>
      </Button>
    </Form>
  );
};

export default SearchBox;
