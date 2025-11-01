import { useState } from "react";
import {
  Col,
  Row,
  Flex,
  Image,
  Typography,
  Form,
  Input,
  Button,
  Alert,
  Spin,
  message,
} from "antd";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import loginImage from "../../assets/login-img.jpg";
import logo from "../../assets/CoreDesk-crop.png";
import userService from "../../services/userService";

const { Title, Paragraph } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSuccess, setSuccess] = useState(false);
  const [isLoad, setLoad] = useState(false);
  const [visible, setClosed] = useState(false);
  const [messageError, setMessage] = useState("");
  const regexLowercase = /^(?=.*[a-z]).+$/;
  const regexUpercase = /^(?=.*[A-Z]).+$/;
  const regexNumber = /^(?=.*\d).+$/;
  const regexSymbol = /^(?=.*[\W_]).+$/;
  const regexMinCharacter = /^.{8,}$/;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const success = () => {
    messageApi.open({
      type: "success",
      content: "your account has been created",
    });
  };
  const onFinish = async (values) => {
    try {
      const credenttial = {
        first_name: values.firstname,
        email: values.email,
        password: values.password,
      };
      if (values.lastname) credenttial.last_name = values.lastname;
      console.log(JSON.stringify(credenttial));

      setLoad(true);
      const res = await userService.register(credenttial);
      success();
      await delay(1000);
      setLoad(false);
      setClosed(false);
      navigate("/");
    } catch (error) {
      setClosed(true);
      setLoad(false);
      setMessage(`${error.response?.data?.error}`);
    }
  };
  const onFinishFailed = (errorInfo) => {};
  const handleClose = () => {
    setClosed(false);
  };
  return (
    <>
      {contextHolder}
      <Row>
        <Col xs={0} md={8}>
          <Image
            src={loginImage}
            height="100vh"
            width="100%"
            preview={false}
            style={{ objectFit: "cover" }}
          />
        </Col>
        <Col xs={24} md={16}>
          <Flex
            justify="flex-end"
            align="center"
            style={{ paddingTop: "10px", paddingRight: "10px" }}
          ></Flex>
          <Flex
            vertical
            justify="center"
            align="center"
            style={{ height: "100vh" }}
          >
            <Image
              src={logo}
              width="150px"
              preview={false}
              style={{ objectFit: "cover", marginBottom: "20px" }}
            />
            <div style={{ width: "340px" }}>
              <Typography style={{ paddingBottom: "24px" }}>
                <Flex vertical justify="center" align="center">
                  <Title level={2} style={{ fontWeight: "bold" }}>
                    Create an Account
                  </Title>
                  <Paragraph style={{ textAlign: "center", width: "300px" }}>
                    Create a ticket for your issue, and we’ll take care of it
                  </Paragraph>
                </Flex>
              </Typography>
              {visible && (
                <div style={{ paddingBottom: "24px" }}>
                  <Alert
                    message={messageError}
                    type="error"
                    closable
                    showIcon
                    afterClose={handleClose}
                    style={{ color: "red" }}
                  />
                </div>
              )}
              {isLoad ? (
                <Flex justify="center">
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </Flex>
              ) : (
                <Form
                  name="auth"
                  initialValues={{ remember: true }}
                  layout="vertical"
                  size="large"
                  style={{
                    width: "100%",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    name="firstname"
                    label="First Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item name="lastname" label="Last Name">
                    <Input placeholder="Last Name" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please input your Email!" },
                      { type: "email", message: "Please input true email" },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                      {
                        pattern: regexLowercase,
                        message: "- At least one lowercase letter",
                      },
                      {
                        pattern: regexUpercase,
                        message: "- At least one uppercase letter",
                      },
                      {
                        pattern: regexNumber,
                        message: "- At least one number",
                      },
                      {
                        pattern: regexSymbol,
                        message: "- At least one symbol",
                      },
                      {
                        pattern: regexMinCharacter,
                        message: "- Minimal 8 character",
                      },
                    ]}
                  >
                    <Input.Password type="password" placeholder="Password" />
                  </Form.Item>
                  <Form.Item
                    name="confirmpassword"
                    label="Confirm Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Konfirmasi password tidak cocok")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button block type="primary" htmlType="submit">
                      Register
                    </Button>
                    <div
                      style={{
                        paddingTop: "24px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Alredy have an account ?{" "}
                      <Link to="/" style={{ fontWeight: "bolder", paddingLeft: "10px" }}>Login!</Link>
                      {/* <a
                        href="/"
                        style={{ fontWeight: "bolder", paddingLeft: "10px" }}
                      >
                        Login!
                      </a> */}
                    </div>
                  </Form.Item>
                </Form>
              )}
            </div>
          </Flex>
        </Col>
      </Row>
    </>
  );
};
export default Register;
