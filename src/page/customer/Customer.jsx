import {
  Alert,
  Button,
  Flex,
  Form,
  Popconfirm,
  Spin,
  Table,
  Input,
  message,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { LuPencil, LuTrash2,LuSearch } from "react-icons/lu";
import priorityService from "../../services/priorityServices";
import userService from "../../services/userService";
import UserModal from "../../component/UserModal";
import roleService from "../../services/roleService";

const Customer = () => {
  useEffect(() => {
    dataInit();
  }, []);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query); // update setelah delay
    }, 500); // delay 500ms

    return () => {
      clearTimeout(handler); // bersihkan timeout tiap kali user ngetik lagi
    };
  }, [query]);
  useEffect(() => {
    // if (debouncedQuery) {
    //   console.log("Call API with:", debouncedQuery);
    // fetch(`https://api.example.com/search?q=${debouncedQuery}`)
    getUsers(debouncedQuery);
    // }
    // console.log("SOME");
  }, [debouncedQuery]);
  const [messageApi, contextHolder] = message.useMessage();
  const [dataUser, setDataUser] = useState([]);
  const [dataRole, setDataRole] = useState([]);
  const [dataEdit, setDataEdit] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const dataInit = async () => {
    // await getUsers();
    await getRole();
  };
  const getUsers = async (search) => {
    try {
      const res = await userService.getCustomer(`search=${search??""}`);
      console.log(res.data);

      setDataUser(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getRole = async () => {
    try {
      const res = await roleService.getRole();
      setDataRole(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const res = await userService.deleteUser(id);
      console.log(res.data);
      // setIsWarning(res.res)
      getUsers();
    } catch (error) {
      console.log(error);
      setIsWarning(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  const uploadAgent = async (value) => {
    console.log("Upload Ganet", value);
    const email = value.email;
    const name = email.slice(0, email.indexOf("@"));
    try {
      setLoading(true);
      const payload = {
        first_name: name,
        email: value.email,
        role_id: value.role,
        password: "Password123",
      };
      const res = dataEdit
        ? await userService.updateUser(dataEdit.id, payload)
        : await userService.register(payload);
      getUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const dataSourceApi = dataUser.map((e) => ({
    key: e.id,
    name: e.first_name.concat(" ", e.last_name),
    email: e.email,
    role_name: e.role.role_name,
    role_id: e.role.id,
    createdAt: dayjs(e.createdAt).format("MMMM D, YYYY"),
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text, record) => (
    //     <>

    //       <Popconfirm
    //         title="Delete the customer"
    //         description="Are you sure to delete this customer?"
    //         icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    //         onConfirm={() => {
    //           deleteUser(record.key);
    //         }}
    //       >
    //         <Button
    //           shape="default"
    //           type="text"
    //           color="danger"
    //           variant="text"
    //           icon={<LuTrash2 />}
    //         />
    //       </Popconfirm>
    //     </>
    //   ),
    // },
  ];
  const getRoleData = dataRole.map((e) => ({
    value: e.id,
    label: `${e.role_name}`,
  }));
  const modalTriger = (isModal, data) => {
    if (data) {
      const dataEd = {
        id: data.key,
        email: data.email,
      };
      setDataEdit(dataEd);
    } else {
      setDataEdit();
    }
    setIsModalOpen(isModal);
  };
  return (
    <>
      <UserModal
        modalTitle={dataEdit ? "Update Agent" : "Add Customer"}
        formName="customers"
        formLabel="customer"
        isModalOpen={isModalOpen}
        isModalLoading={isLoading}
        isMember={false}
        roleData={getRoleData}
        onCancel={() => modalTriger(false)}
        onFinish={uploadAgent}
        formVal={dataEdit ?? null}
      />
      {contextHolder}

      <div>
        <Flex justify="space-between" align="center">
          <div>
            <h1>Customer</h1>
            <p>Find you customer </p>
          </div>
          <Button
            color="primary"
            variant="solid"
            onClick={() => modalTriger(true)}
          >
            New Customer
          </Button>
          {/* <StatusPriorityModal
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
            formVal={isEdit ? dataModal.name : null}
          /> */}
        </Flex>
        <div style={{ paddingBottom: 12 }}>
          <Input
            placeholder="Search member"
            prefix={<LuSearch />}
            style={{ width: "30%" }}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {isWarning && (
          <div style={{ paddingBottom: "12px" }}>
            <Alert
              banner
              message={isWarning}
              type="error"
              // onClose={() => getWarning()}
              closable
            />
          </div>
        )}
        {isLoading ? (
          <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
        ) : (
          <>
            {/* {isBodyError && (
              <div style={{ paddingBottom: "14px" }}>
                <Alert description={isBodyError} type="error" closable />
              </div>
            )} */}
            <Table dataSource={dataSourceApi} columns={columns} />
          </>
        )}
      </div>
    </>
  );
};
export default Customer;
