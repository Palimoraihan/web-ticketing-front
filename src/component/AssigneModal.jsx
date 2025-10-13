import { Form, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import userService from "../services/userService";

const AssigneeModal = ({ isModal, onCancel, onFinish }) => {
  useEffect(() => {
    fetchAgent();
  }, []);
  const [form] = Form.useForm();
  const [dataAgent, setAgent] = useState([]);
  const fetchAgent = async () => {
    try {
      const res = await userService.getAgent();

      const getAgent = res.data.map((e) => ({
        value: e.id,
        label: `${e.first_name}  ${e.last_name ?? ""}`,
      }));
      setAgent(getAgent);
      console.log("GETDATA Agent", res);
    } catch (error) {
      console.log("Category Error", error);
    } finally {
    }
  };
  return (
    <>
      <Modal
        title="Assignee"
        centered
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        open={isModal}
        onCancel={onCancel}
        modalRender={(dom) => (
          <Form
            name={"change3Form"}
            // initialValues={{
            //   assignee: agentId,
            // }}
            clearOnDestroy
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item name={"assignee"} label="Assignee to">
          <Select
            showSearch
            placeholder="Select a person"
            options={dataAgent}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
export default AssigneeModal;
