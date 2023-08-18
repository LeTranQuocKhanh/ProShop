import React, { useState, useRef } from "react";
import { Button, Modal, Card, ListGroup } from "react-bootstrap";

const MyVerticallyCenteredModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.product.detailName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="card border-primary">
          <ListGroup variant="flush">
            <ListGroup.Item>Thương hiệu: {props.product.brand}</ListGroup.Item>
            <ListGroup.Item>
              Công nghệ CPU: {props.product.techCPU}
            </ListGroup.Item>
            <ListGroup.Item>
              Tốc độ CPU: {props.product.speedCPU}
            </ListGroup.Item>
            <ListGroup.Item>
              RAM: {props.product.ram}GB Loại Ram: {props.product.typeRam}
            </ListGroup.Item>
            <ListGroup.Item>Ổ cứng: {props.product.detailSSD}</ListGroup.Item>
            <ListGroup.Item>
              Kích thước màn hình: {props.product.screenSize}
            </ListGroup.Item>
            <ListGroup.Item>
              Độ phân giải: {props.product.resolution}
            </ListGroup.Item>
            <ListGroup.Item>
              Công nghệ màn hình: {props.product.techScreen}
            </ListGroup.Item>
            <ListGroup.Item>
              Card đồ họa: {props.product.graphicCard}
            </ListGroup.Item>
            <ListGroup.Item>
              Công nghệ âm thanh: {props.product.techSound}
            </ListGroup.Item>
            <ListGroup.Item>
              Cổng giao tiếp: {props.product.gate}
            </ListGroup.Item>
            <ListGroup.Item>
              Kết nối không dây: {props.product.wireless}
            </ListGroup.Item>
            <ListGroup.Item>
              Khe đọc thẻ nhớ: {props.product.microSD ? "Có" : "Không"}
            </ListGroup.Item>
            <ListGroup.Item>
              Ổ đĩa quang: {props.product.opticalDrive ? "Có" : "Không"}
            </ListGroup.Item>
            <ListGroup.Item>
              Đèn bàn phím:: {props.product.ledKeyboard ? "Có" : "Không"}
            </ListGroup.Item>
            <ListGroup.Item>Hệ điều hành: {props.product.os}</ListGroup.Item>
            <ListGroup.Item>
              Thông tin Pin: {props.product.pinInfomation}
            </ListGroup.Item>
            <ListGroup.Item>Trọng lượng: {props.product.weight}</ListGroup.Item>
            <ListGroup.Item>Chất liệu: {props.product.material}</ListGroup.Item>
          </ListGroup>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyVerticallyCenteredModal;
