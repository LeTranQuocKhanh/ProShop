import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [ram, setRam] = useState(4);
  const [ssd, setSSD] = useState(128);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Laptop");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const [detailName, setDetailName] = useState("Samle detail name");
  const [techCPU, setTechCPU] = useState("Sample tech CPU");
  const [speedCPU, setSpeedCPU] = useState("Sample speed CPU");
  const [typeRam, setTypeRam] = useState("Sample type ram");
  const [detailSSD, setDetailSSD] = useState("Sample detail SSD");
  const [screenSize, setScreenSize] = useState("Sample screen size");
  const [resolution, setResolution] = useState("Sample resolution");
  const [techScreen, setTechScreen] = useState("Sample tech screen");
  const [graphicCard, setGraphicCard] = useState("Sample graphic card");
  const [techSound, setTechSound] = useState("Sample tech sound");
  const [gate, setGate] = useState("Sample gate");
  const [wireless, setWireless] = useState("Sample wireless");
  const [microSD, setMicroSD] = useState(0);
  const [opticalDrive, setOpticalDrive] = useState(0);
  const [ledKeyboard, setLedKeyboard] = useState(0);
  const [os, setOs] = useState("Sample os");
  const [pinInfomation, setPinInformation] = useState("Sample pin information");
  const [size, setSize] = useState("Sample size");
  const [weight, setWeight] = useState(1);
  const [material, setMaterial] = useState("Sample material");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setRam(product.ram);
        setSSD(product.ssd);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setDetailName(product.detailName);
        setTechCPU(product.speedCPU);

        setSpeedCPU(product.speedCPU);

        setTypeRam(product.typeRam);

        setDetailSSD(product.detailSSD);

        setScreenSize(product.sreenSize);

        setResolution(product.resolution);

        setTechScreen(product.techScreen);

        setGraphicCard(product.graphicCard);

        setTechSound(product.techSound);

        setGate(product.gate);

        setWireless(product.wireless);

        setMicroSD(product.microSD);

        setOpticalDrive(product.opticalDrive);

        setLedKeyboard(product.ledKeyboard);

        setOs(product.os);

        setPinInformation(product.pinInfomation);

        setSize(product.size);

        setWeight(product.weight);

        setMaterial(product.material);
      }
    }
  }, [dispatch, history, productId, product, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        detailName,
        techCPU,
        speedCPU,
        typeRam,
        detailSSD,
        screenSize,
        resolution,
        techScreen,
        graphicCard,
        techSound,
        gate,
        wireless,
        microSD,
        opticalDrive,
        ledKeyboard,
        os,
        pinInfomation,
        size,
        weight,
        material,
        price,
        image,
        brand,
        category,
        ram,
        ssd,
        description,
        countInStock,
      })
    );
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-secondary my-3">
        Quay lại
      </Link>
      {/* <FormContainer> */}
      <h1>
        <strong>Chỉnh sửa sản phẩm</strong>
      </h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label>Tên sản phẩm hiển thị:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên sản phẩm hiển thị"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="detailName">
                <Form.Label>Tên sản phẩm chi tiết:</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Nhập tên sản phẩm chi tiết"
                  value={detailName}
                  onChange={(e) => setDetailName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>Giá (VNĐ):</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={100000000}
                  required
                  placeholder="Nhập giá sản phẩm"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group
                controlId="ram"
                style={{ paddingTop: "10px" }}
                required
              >
                <Form.Label>RAM:</Form.Label>{" "}
                <select value={ram} onChange={(e) => setRam(e.target.value)}>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={32}>32</option>
                </select>
              </Form.Group>
              <Form.Group controlId="typeRam">
                <Form.Label>Chi tiết RAM:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập chi tiết RAM"
                  value={typeRam}
                  onChange={(e) => setTypeRam(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group
                controlId="ssd"
                style={{ paddingTop: "10px" }}
                required
              >
                <Form.Label>SSD:</Form.Label>{" "}
                <select value={ssd} onChange={(e) => setSSD(e.target.value)}>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
              </Form.Group>
              <Form.Group controlId="detailSSD">
                <Form.Label>Chi tiết SSD:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập chi tiết SSD"
                  value={detailSSD}
                  onChange={(e) => setDetailSSD(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="techCPU">
                <Form.Label>Công nghệ CPU:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập công nghệ CPU"
                  value={techCPU}
                  onChange={(e) => setTechCPU(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="speedCPU">
                <Form.Label>Tốc độ CPU:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tốc độ CPU"
                  value={speedCPU}
                  onChange={(e) => setSpeedCPU(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="screenSize">
                <Form.Label>Kích thước màn hình:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập kích thước màn hình"
                  value={screenSize}
                  onChange={(e) => setScreenSize(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="resolution">
                <Form.Label>Độ phân giải màn hình:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập độ phân giải màn hình"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="techScreen">
                <Form.Label>Công nghệ màn hình:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập công nghệ màn hình"
                  value={techScreen}
                  onChange={(e) => setTechScreen(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="graphicCard">
                <Form.Label>Card đồ họa:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập card đồ họa"
                  value={graphicCard}
                  onChange={(e) => setGraphicCard(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="techSound">
                <Form.Label>Công nghệ âm thanh:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập công nghệ âm thanh"
                  value={techSound}
                  onChange={(e) => setTechSound(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="gate">
                <Form.Label>Cổng giao tiếp:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập cổng giao tiếp"
                  value={gate}
                  onChange={(e) => setGate(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="image">
                <Form.Label>Hình ảnh sản phẩm:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập url của hình ảnh sản phẩm"
                  value={image}
                  required
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
                <Form.File
                  id="image-file"
                  label="Chọn file trong máy"
                  custom
                  onChange={uploadFileHandler}
                ></Form.File>
                {uploading && <Loader />}
              </Form.Group>
              <Form.Group controlId="brand">
                <Form.Label>Thương hiệu</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập thương hiệu"
                  value={brand}
                  required
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="wireless">
                <Form.Label>Kết nối không dây:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập kết nối không dây"
                  value={wireless}
                  onChange={(e) => setWireless(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="microSD" style={{ paddingTop: "10px" }}>
                <Form.Label>Thẻ Micro SD:</Form.Label>{" "}
                <select
                  value={microSD}
                  onChange={(e) => setMicroSD(e.target.value)}
                >
                  <option value={1}>Có</option>
                  <option value={0}>Không</option>
                </select>
              </Form.Group>
              <Form.Group
                controlId="opticalDrive"
                style={{ paddingTop: "10px" }}
              >
                <Form.Label>Ổ đĩa quang:</Form.Label>{" "}
                <select
                  value={opticalDrive}
                  onChange={(e) => setOpticalDrive(e.target.value)}
                >
                  <option value={1}>Có</option>
                  <option value={0}>Không</option>
                </select>
              </Form.Group>
              <Form.Group
                controlId="ledKeyboard"
                style={{ paddingTop: "10px" }}
              >
                <Form.Label>Led bàn phím:</Form.Label>{" "}
                <select
                  value={ledKeyboard}
                  onChange={(e) => setLedKeyboard(e.target.value)}
                >
                  <option value={1}>Có</option>
                  <option value={0}>Không</option>
                </select>
              </Form.Group>
              <Form.Group controlId="os">
                <Form.Label>Hệ điều hành:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập hệ điều hành"
                  value={os}
                  onChange={(e) => setOs(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="pinInfomation">
                <Form.Label>Thông tin pin:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập thông tin pin"
                  value={pinInfomation}
                  onChange={(e) => setPinInformation(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="size">
                <Form.Label>Kích thước:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập kích thước"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="weight">
                <Form.Label>Khối lượng (kg):</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập khối lượng"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="material">
                <Form.Label>Chất liệu:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập chất liệu"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="countInStock">
                <Form.Label>Số lượng sản phẩm:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Nhập số lượng sản phẩm"
                  value={countInStock}
                  min={0}
                  max={50}
                  required
                  onChange={(e) => setCountInStock(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập loại sản phẩm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Giới thiệu sản phẩm:</Form.Label>
                <Form.Control
                  as="textarea"
                  row="3"
                  placeholder="Nhập giới thiệu sản phẩm"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="primary" className="mt-3">
            Cập nhật sản phẩm
          </Button>
        </Form>
      )}
      {/* </FormContainer> */}
    </>
  );
};

export default ProductEditScreen;
