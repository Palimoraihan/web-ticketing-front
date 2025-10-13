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
} from "antd";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import loginImage from "../../assets/login-img.jpg";
import logo from "../../assets/CoreDesk-crop.png";
import userService from "../../services/userService";
import { useAuth } from "../../feature/auth/AuthContext";

const { Title, Paragraph } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [isLoad, setLoad] = useState(false);
  const [visible, setClosed] = useState(false);
  const [messageError, setMessage] = useState("");
  const { user, login } = useAuth();

  const onFinish = async (values) => {
    try {
      const credenttial = { email: values.email, password: values.password };
      setLoad(true);
      const res = await userService.login(credenttial);
      setLoad(false);
      setClosed(false);
      const user = {
        id: res.data.user.id,
        first_name: res.data.user.first_name,
        last_name: res.data.user.last_name,
        role: res.data.user.role_id,
        token: res.data.token,
      };
      login(user);

      navigate("/ticket");
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
                  Welcome to CoreDesk
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
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input.Password type="password" placeholder="Password" />
              </Form.Item>
              {isLoad ? (
                <Flex justify="center">
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </Flex>
              ) : (
                <Form.Item>
                  <Button block type="primary" htmlType="submit">
                    Log in
                  </Button>
                  <div
                    style={{
                      paddingTop: "24px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Dont have account ?{" "}
                    <a
                      href="/register"
                      style={{ fontWeight: "bolder", paddingLeft: "10px" }}
                    >
                      Register now!
                    </a>
                  </div>
                </Form.Item>
              )}
            </Form>
          </div>
        </Flex>
      </Col>
    </Row>
  );
};
export default Login;
