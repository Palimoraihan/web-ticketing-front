import {
  Alert,
  Button,
  Flex,
  Form,
  Popconfirm,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import statusService from "../../../services/statusServices";
import messageError from "../../../comont/messageError.json";
import successMessage from "../../../comont/messageSuccess.json";
import StatusPriorityModal from "../../../component/StatusPriorityModal";
const StatusPage = () => {
  useEffect(() => {
    getStatus();
  }, []);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStatus, setDataStatus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState();
  const [isBodyError, setBodyError] = useState();
  const [isModalLoading, setModalLoading] = useState(false);
  const [dataModal, setDataModal] = useState();
  const [form] = Form.useForm();

  const getStatus = async () => {
    try {
      const res = await statusService.getStatus();
      setDataStatus(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (isEdited, dataMap) => {
    setIsEdit(isEdited);
    if (isEdited) {
      setDataModal(dataMap);
      console.log("STATUS DATA MAP", dataMap);
    }
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleOk = async (value) => {
    try {
      setModalLoading(true);
      const data = {
        name: value.name,
        color:
          typeof value.color === "string"
            ? value.color
            : value.color.toHexString(),
      };
      if (isEdit) {
        await statusService.updateStatus(data, dataModal.key);
      } else {
        await statusService.createStatus(data);
      }

      setIsModalOpen(false);
      getStatus();
      const message = isEdit
        ? successMessage.success.resource.update_success.message.replace(
            "{resource}",
            "Status"
          )
        : successMessage.success.resource.create_success.message.replace(
            "{resource}",
            "Status"
          );
      messageApi.open({
        type: "success",
        content: message,
      });
    } catch (error) {
      console.log(error);

      let errorMessage;
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = messageError.validation.required.message.replace(
              "{field}",
              "name"
            );
            break;
          case 409:
            errorMessage = messageError.resource.alredy.message.replace(
              "{field}",
              "name"
            );
            break;
          default:
            errorMessage = messageError.server.internal_error.message;
            break;
        }
      } else {
        errorMessage = "No response from server";
      }
      setError(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  const deleteData = async (id) => {
    console.log(id);
    try {
      setLoading(true);
      await statusService.deleteStatus(id);
      getStatus();
      setLoading(false);
      if (isBodyError) return setBodyError(null);
    } catch (error) {
      let errorMessage;
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = messageError.resource.not_found.message;
            break;
          case 409:
            errorMessage = messageError.resource.in_use.message.replace(
              "{field}",
              "status"
            );
            break;
          default:
            errorMessage = messageError.server.internal_error.message;
            break;
        }
      } else {
        errorMessage = "No response from server";
      }
      setBodyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const dataSourceApi = dataStatus.map((e) => ({
    key: e.id,
    name: { name: e.name, color: e.color },
    createdAt: dayjs(e.createdAt).format("MMMM D, YYYY"),
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (status) => (
        <>
          <Tag color={status.color}>{status.name}</Tag>
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            shape="default"
            type="text"
            color="primary"
            variant="text"
            icon={<LuPencil />}
            onClick={() => {
              showModal(true, record);
            }}
          />
          <Popconfirm
            title="Delete the status"
            description="Are you sure to delete this status?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => {
              deleteData(record.key);
            }}
          >
            <Button
              shape="default"
              type="text"
              color="danger"
              variant="text"
              icon={<LuTrash2 />}
            />
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <div>
        <Flex justify="space-between" align="center">
          <div>
            <h1>Status</h1>
            <p>Manage your status </p>
          </div>
          <Button
            color="primary"
            variant="solid"
            onClick={() => showModal(false)}
          >
            New Status
          </Button>
          <StatusPriorityModal
            isEdit={isEdit}
            modalTitle={isEdit ? "Update Status" : "New Status"}
            formLabel={"status"}
            isModalOpen={isModalOpen}
            onCancel={() => handleCancel(false)}
            isModalLoading={isModalLoading}
            form={form}
            formName={"firstForm"}
            isError={isError}
            onFinish={handleOk}
            formVal={isEdit ? dataModal : null}
          />
        </Flex>
        {isLoading ? (
          <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
        ) : (
          <>
            {isBodyError && (
              <div style={{ paddingBottom: "14px" }}>
                <Alert description={isBodyError} type="error" closable />
              </div>
            )}
            <Table dataSource={dataSourceApi} columns={columns} />
          </>
        )}
      </div>
    </>
  );
};
export default StatusPage;
