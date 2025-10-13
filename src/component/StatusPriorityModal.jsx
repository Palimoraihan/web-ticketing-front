import { Alert, Form, Modal, Input, ColorPicker } from "antd";
import { useEffect } from "react";

const StatusPriorityModal = ({
  isEdit,
  modalTitle,
  formLabel,
  isModalOpen,
  isModalLoading,
  onCancel,
  form,
  formName,
  onFinish,
  isError,
  formVal,
}) => {
  return (
    <>
      <Modal
        title={modalTitle}
        centered
        open={isModalOpen}
        // onOk={handleOk}
        confirmLoading={isModalLoading}
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={onCancel}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            form={form}
            name={formName}
            clearOnDestroy
            onFinish={(value) => onFinish(value)}
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
          name="name"
          label="Name"
          initialValue={formVal?.name.name ?? ""}
          rules={[
            {
              required: true,
              message: `Please input ${formLabel} name!`,
            },
          ]}
        >
          <Input placeholder={`Please input ${formLabel} name`} />
        </Form.Item>
        <Form.Item
          name="color"
          label="Color Pick"
          initialValue={formVal ? formVal.name.color : "#ffffff"}
          // rules={[
          //   {
          //     required: true,
          //     message: `Please input ${formLabel} name!`,
          //   },
          // ]}
        >
          {/* <Input placeholder={`Please input ${formLabel} name`} /> */}
          <ColorPicker defaultFormat="hex" size="large" showText />
        </Form.Item>
      </Modal>
    </>
  );
};
export default StatusPriorityModal;
