import { Alert, Form, Modal, Input, Select, Space } from "antd";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const UserModal = ({
  isEdit,
  modalTitle,
  formLabel,
  isModalOpen,
  isModalLoading,
  isMember,
  onCancel,
  formName,
  onFinish,
  isError,
  roleData,
  formVal,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    initData();
  }, [formVal]);
  const initData = () => {
    if (formVal) {
      console.log("INIT DATA", formVal);

      // form.setFieldValue({
      //   email:formVal.email
      // })
      form.setFieldsValue({
        email: formVal.email,
        role: formVal.role_id,
      });
    }
  };
  return (
    <>
      <Modal
        title={modalTitle}
        centered
        destroyOnHidden
        open={isModalOpen}
        // onOk={handleOk}
        loading={isModalLoading}
        confirmLoading={isModalLoading}
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
        modalRender={(dom) => (
          <Form
            form={form}
            name={formName}
            // clearOnDestroy
            onFinish={(value) => {
              onFinish(value);
              form.resetFields();
            }}
          >
            {dom}
          </Form>
        )}
      >
        {isError && (
          <div style={{ paddingBottom: "14px" }}>
            <Alert description={isError} type="error" closable />
          </div>
        )}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "Please input true email" },
          ]}
        >
          <Input
            disabled={formVal ? true : false}
            placeholder={`Please input email`}
          />
        </Form.Item>
        {isMember && (
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select the role" }]}
          >
            <Select
              showSearch
              placeholder="Select a role"
              optionFilterProp="label"
              style={{ width: "100%" }}
              //   onChange={onChange}
              //   onSearch={onSearch}
              options={roleData}
              optionRender={(option) => (
                <Space>
                  <UserOutlined />
                  <p style={{ padding: "0px", margin: "0" }}>{option.label}</p>
                </Space>
              )}
            />
          </Form.Item>
        )}
      </Modal>
    </>
  );
};
export default UserModal;
