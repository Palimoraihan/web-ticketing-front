import {
  Button,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TextArea from "antd/es/input/TextArea";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import ticketService from "../services/ticketService";
import errorMassage from "../comont/messageError.json";
import successMessage from "../comont/messageSuccess.json";
import { useAuth } from "../feature/auth/AuthContext";
const DrawerTicket = ({
  isOpen,
  isLoading,
  onClose,
  dataCategory,
  dataCustomer,
  dataAgent,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dataPriority, setPriority] = useState([]);
  const [isLoadUpload, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const getCategory = dataCategory.map((e) => ({
    value: e.id,
    label: e.name,
  }));
  const getCustomer = dataCustomer.map((e) => ({
    value: e.id,
    label: `${e.first_name}  ${e.last_name ?? ""}`,
  }));
  const getAgent = dataAgent.map((e) => ({
    value: e.id,
    label: `${e.first_name}  ${e.last_name ?? ""}`,
  }));
  const closeDrawer = () => {
    onClose();
    setPriority([]);
    form.resetFields();
  };
  const onFinish = async (value) => {
    try {
      setLoading(true);
      const payload = {
        subject: value.subject,
        user_id: value.requester??user.id,
        agent_id: value.assigne,
        category_id: value.category,
        priority_id: value.priority,
        status_id: 1,
        comment: value.comment,
      };
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);
      const res = await ticketService.createTicket(
        payload,
        `Bearer ${parsToJson.token}`
      );
      console.log("Error Create Ticket", value);
      onSuccesMessage();
      closeDrawer();
      navigate(0);
    } catch (error) {
      console.log("Error Create Ticket", error);
      onErrorMessage();
    } finally {
      setLoading(false);
    }
  };
  const handleChangeCategory = (value) => {
    form.setFieldsValue({ priority: "" });
    const getCategoryById = dataCategory.find(
      (categry) => categry.id === value
    );
    setPriority(getCategoryById.sla);
  };
  const onErrorMessage = () => {
    const message = errorMassage.server.internal_error;
    messageApi.open({
      type: "error",
      content: message.message,
    });
  };
  const onSuccesMessage = () => {
    const message =
      successMessage.success.resource.create_success.message.replace(
        "{resource}",
        "Ticket"
      );
    messageApi.open({
      type: "success",
      content: message.message,
    });
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title="Create New Ticket"
        width={720}
        onClose={closeDrawer}
        open={isOpen}
      >
        {isLoading || isLoadUpload ? (
          <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
        ) : (
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[
                    { required: true, message: "Please enter user name" },
                  ]}
                >
                  <Input placeholder="Please enter subject" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please enter user name" },
                  ]}
                >
                  <Select
                    options={getCategory}
                    onChange={handleChangeCategory}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="Priority"
                  rules={[{ required: true, message: "Please enter priority" }]}
                >
                  <Select
                    disabled={dataPriority.length <= 0 ? true : false}
                    options={dataPriority.map((e) => ({
                      value: e.priority.id,
                      label: e.priority.name,
                    }))}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            {user.role !== 3 && (
              <>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="requester"
                      label="Requester"
                      rules={[
                        { required: true, message: "Please enter user name" },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="label"
                        style={{ width: "100%" }}
                        //   onChange={onChange}
                        //   onSearch={onSearch}

                        options={getCustomer}
                        optionRender={(option) => (
                          <Space>
                            <UserOutlined />
                            <p style={{ padding: "0px", margin: "0" }}>
                              {option.label}
                            </p>
                          </Space>
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="assigne"
                      label="Assigne"
                      // rules={[
                      //   { required: true, message: "Please enter user name" },
                      // ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="label"
                        style={{ width: "100%" }}
                        options={getAgent}
                        optionRender={(option) => (
                          <Space>
                            <UserOutlined />
                            <p style={{ padding: "0px", margin: "0" }}>
                              {option.label}
                            </p>
                          </Space>
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <Row>
              <Col span={24}>
                <Form.Item name="comment" label="Comment">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Flex justify="flex-end">
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  // onClick={closeDrawerOnClick}
                >
                  Submit
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        )}
      </Drawer>
    </>
  );
};
export default DrawerTicket;
