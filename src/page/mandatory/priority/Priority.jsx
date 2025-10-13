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
import { LoadingOutlined,QuestionCircleOutlined } from "@ant-design/icons";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import priorityService from "../../../services/priorityServices";
import messageError from "../../../comont/messageError.json";
import successMessage from "../../../comont/messageSuccess.json";
import StatusPriorityModal from "../../../component/StatusPriorityModal";

const PriorityPage = () => {
  useEffect(() => {
    getPriority();
  }, []);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataPriority, setDataPriority] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState();
  const [isBodyError, setBodyError] = useState();
  const [isModalLoading, setModalLoading] = useState(false);
  const [dataModal, setDataModal] = useState();
  const [form] = Form.useForm();

  const getPriority = async () => {
    try {
      const res = await priorityService.getPriority();
      setDataPriority(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (isEdited, dataMap) => {
    setIsEdit(isEdited);
    if (isEdited) {
      console.log(dataMap);
      
      setDataModal(dataMap);
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
        await priorityService.updatePriority(data, dataModal.key);
      } else {
        await priorityService.createPriority(data);
      }

      setIsModalOpen(false);
      getPriority();
      const message = isEdit
        ? successMessage.success.resource.update_success.message.replace(
            "{resource}",
            "Priority"
          )
        : successMessage.success.resource.create_success.message.replace(
            "{resource}",
            "Priority"
          );
      messageApi.open({
        type: "success",
        content: message,
      });
    } catch (error) {
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
      await priorityService.deletePriority(id);
      getPriority();
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
              "priority"
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

  const dataSourceApi = dataPriority.map((e) => ({
    key: e.id,
    name: { name: e.name, color: e.color },
    createdAt: dayjs(e.createdAt).format("MMMM D, YYYY"),
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
       render: (priority) => (
        <>
          <Tag color={priority.color}>{priority.name}</Tag>
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
            title="Delete the priority"
            description="Are you sure to delete this priority?"
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
            <h1>Priority</h1>
            <p>Manage your priority </p>
          </div>
          <Button
            color="primary"
            variant="solid"
            onClick={() => showModal(false)}
          >
            New Priority
          </Button>
          <StatusPriorityModal
            isEdit={isEdit}
            modalTitle={isEdit ? "Update Priority" : "New Priority"}
            formLabel={"priority"}
            isModalOpen={isModalOpen}
            onCancel={() => handleCancel(false)}
            isModalLoading={isModalLoading}
            form={form}
            formName={"secForm"}
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
export default PriorityPage;
