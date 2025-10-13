import { Form, Modal, Select } from "antd";
import categoryService from "../services/categoryService";
import { useEffect, useState } from "react";
import statusService from "../services/statusServices";

const TicketDetailModal = ({
  statusId,
  categoryId,
  priorityId,
  isModal,
  onCancel,
  onFinish,
}) => {
  useEffect(() => {
    fetchCategory();
    fetchStatus();
  }, []);
  const [dataCategory, setCategory] = useState([]);
  const [dataStatus, setStatus] = useState([]);
  const [dataCategoryRes, setCategoryRes] = useState([]);
  const [dataPriority, setPriority] = useState([]);
  const [form] = Form.useForm();
  const fetchCategory = async () => {
    try {
      const res = await categoryService.getCategory();

      const getCategory = res.data.map((e) => ({
        value: e.id,
        label: e.name,
      }));
      setCategory(getCategory);
      setCategoryRes(res.data);
      const getCategoryById = res.data.find(
        (category) => category.id === categoryId
      );

      setPriority(getCategoryById.sla);
      console.log("GETDATA CATEGORY", res);
    } catch (error) {
      console.log("Category Error", error);
    } finally {
    }
  };
  const fetchStatus = async () => {
    try {
      const res = await statusService.getStatus();

      setStatus(res.data);

      console.log("GETDATA STATUS API", res);
      // console.log("GETDATA STATUS API", getStatus);
    } catch (error) {
      console.log("Category Error", error);
    } finally {
      // fetchCustomer();
      // setLoading(false);
    }
  };
  const handleChangeCategory = (value) => {
    const getCategoryById = dataCategoryRes.find(
      (category) => category.id === value
    );
    setPriority(getCategoryById.sla);

    form.setFieldsValue({ priority2: getCategoryById.sla[0].priority.id });
  };
  const getStatus = dataStatus
    .filter((d) => d.id >= statusId)
    .map((e) => ({
      value: e.id,
      label: e.name,
    }));
  return (
    <>
      <Modal
        title="Change Ticket"
        centered
        open={isModal}
        // onOk={{}}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            form={form}
            name={"change2Form"}
            initialValues={{
              status2: statusId,
              category2: categoryId,
              priority2: priorityId,
            }}
            // clearOnDestroy
            onFinish={(value) => {
              const currentStatusId = form.getFieldValue("status2");
              if (statusId != currentStatusId) {
                fetchStatus();
              }

              onFinish(value);
            }}
          >
            {dom}
          </Form>
        )}
      >
        {statusId === 1 && (
          <>
            <Form.Item name={"category2"} label="Category">
              <Select
                showSearch
                placeholder="Select a category"
                options={dataCategory}
                onChange={handleChangeCategory}
              />
            </Form.Item>
            <Form.Item name={"priority2"} label="Priority">
              <Select
                showSearch
                placeholder="Select a priority"
                options={dataPriority.map((e) => ({
                  value: e.priority.id,
                  label: e.priority.name,
                }))}
              />
            </Form.Item>
          </>
        )}
        <Form.Item name={"status2"} label="Status">
          <Select
            showSearch
            placeholder="Select a person"
            options={getStatus}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
export default TicketDetailModal;
