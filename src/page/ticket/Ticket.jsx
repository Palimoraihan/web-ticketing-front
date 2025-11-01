import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAuth } from "../../feature/auth/AuthContext";
import { LuSearch, LuFilter } from "react-icons/lu";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import {
  Flex,
  Input,
  Button,
  Popover,
  Table,
  Typography,
  Tag,
  Avatar,
  Result,
  Spin,
  Select,
  Modal,
  Popconfirm,
  Space,
  Form,
} from "antd";
import FilterComponent from "../../component/FilterComponent";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ticketService from "../../services/ticketService";
import userService from "../../services/userService";
import { Link, useNavigate } from "react-router";
import categoryService from "../../services/categoryService";
import statusService from "../../services/statusServices";
import priorityService from "../../services/priorityServices";
const { confirm } = Modal;
const { Text } = Typography;
const toURLSearchParams = (record) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    params.append(key, value);
  }
  return params;
};
const getRandomuserParams = (params) => {
  const { pagination, filters, sortField, sortOrder, ...restParams } = params;
  const result = {};
  result.limit = pagination?.pageSize;
  result.page = pagination?.current;
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        result[key] = value;
      }
    });
  }
  if (sortField) {
    result.sort = sortField;
    result.order = sortOrder === "ascend" ? "asc" : "desc";
  }
  Object.entries(restParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });
  return result;
};
const Ticket = () => {
  const navigate = useNavigate();
  const [valueCategory, setCategory] = useState(null);
  const { user } = useAuth();
  const [valuePriority, setPriority] = useState(null);
  const [valueStatus, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [dataTicket, setData] = useState([]);
  const [dataAgent, setAgent] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [dataPriority, setDataPriority] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [agentSelect, setAgentSelect] = useState();
  const [isError, setError] = useState();
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const params = toURLSearchParams(getRandomuserParams(tableParams));
  useEffect(() => {
    fetchAgent();
    fetchCategory();
    fetchStatus();
    fetchPriority();
  }, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      // setTableParams({ search: search });
      setDebouncedQuery(search);
      console.log("SEARCH EFFEEECT");
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);
  useEffect(() => {
    fetchTicket();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.category,
    tableParams.priority,
    tableParams.status,
    debouncedQuery,
    JSON.stringify(tableParams.filters),
  ]);

  const fetchTicket = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);

      const res = await ticketService.getTickets(
        params.toString() + `&search=${debouncedQuery}`,
        `Bearer ${parsToJson.token}`
      );
      setData(res.data);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total:
            tableParams.search || tableParams.category ? res.count : res.total,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const fetchAgent = async () => {
    try {
      const res = await userService.getAgent();
      setAgent(res.data);
    } catch (error) {
      console.log("Customer Error", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategory = async () => {
    try {
      const res = await categoryService.getCategory();
      console.log("RESPON CAT", res.data);
      setDataCategory(res.data);
    } catch (error) {
      console.log("CATEGORY ERROR TIC", error);
    }
  };
  const fetchPriority = async () => {
    try {
      const res = await priorityService.getPriority();
      console.log("RESPON Prio", res.data);
      setDataPriority(res.data);
    } catch (error) {
      console.log("CATEGORY ERROR TIC", error);
    }
  };
  const fetchStatus = async () => {
    try {
      const res = await statusService.getStatus();
      console.log("RESPON Status", res.data);
      setDataStatus(res.data);
    } catch (error) {
      console.log("CATEGORY ERROR TIC", error);
    }
  };
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const showConfirm = (ticketId, agentId) => {
    confirm({
      title: "Assign agent ?",
      centered: true,
      content: "Are you sure assign agent to this ticket",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log(`VALUE ASIGN ${ticketId} ${agentId}`);
        uploadAssign(ticketId, agentId);
      },
      onCancel() {
        setAgentSelect();
      },
    });
  };
  const onChange = (value) => {
    console.log(value);
    setAgentSelect(value);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  const uploadAssign = async (ticketId, agentId) => {
    try {
      const payload = {
        id: ticketId,
        agent: {
          agent_id: agentId,
        },
      };
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);
      const res = await ticketService.assignTicket(
        payload,
        `Bearer ${parsToJson.token}`
      );
      // setAgent(res.data);
      fetchTicket();
      console.log("ASIGN SUCCES", res);
    } catch (error) {
      console.log("Customer Error", error);
    } finally {
      setLoading(false);
    }
  };
  const dataDumyCategory = dataCategory.map((e) => ({
    id: e.id,
    name: e.name,
  }));
  const dataDumyPriority = dataPriority.map((e) => ({
    id: e.id,
    name: e.name,
  }));
  const dataDumyStatus = dataStatus.map((e) => ({
    id: e.id,
    name: e.name,
  }));
  const dataParse = dataTicket.map((e) => {
    const now = dayjs();
    const responseAt = e.sla_logs[0].response_at
      ? dayjs(e.sla_logs[0].response_at)
      : null;
    const responseDudateSec = dayjs(e.sla_logs[0].response_duedate_at);
    const responseLeft = responseDudateSec.diff(responseAt ?? now, "second");
    const responseDuration = e.sla.response_time;
    const responsePercentage = Math.max(
      0,
      (responseLeft / responseDuration) * 100
    );
    //RESOLUTION
    const resolutionAt = e.sla_logs[0].resolution_at
      ? dayjs(e.sla_logs[0].resolution_at)
      : null;
    const resolutionDudateSec = dayjs(e.sla_logs[0].resolution_duedate_at);
    const resolutionLeft = resolutionDudateSec.diff(
      resolutionAt ?? now,
      "second"
    );
    const resolutionDuration = e.sla.resolution_time;
    const resolutionPercentage = Math.max(
      0,
      (resolutionLeft / resolutionDuration) * 100
    );
    return {
      key: e.id,
      ticketId: `#TD-${e.id}`,
      subject: e.subject,
      status: { id: e.status.id, name: e.status.name, color: e.status.color },
      priority: {
        id: e.priority.id,
        name: e.priority.name,
        color: e.priority.color,
      },
      category: e.category.name,
      requester: `${e.user.first_name} ${e.user?.first_lastname ?? ""}`,
      assignee: e.agent
        ? `${e.agent.first_name} ${e.agent?.first_lastname ?? ""}`
        : null,
      responseDuedate: dayjs(e.sla_logs[0].response_duedate_at).format(
        "MMMM D, YYYY h:mm A"
      ),
      responsePercentage: responsePercentage,
      resolutionDuedate: dayjs(e.sla_logs[0].resolution_duedate_at).format(
        "MMMM D, YYYY h:mm A"
      ),
      resolutionPercentage: resolutionPercentage,
      requestDate: dayjs(e.createdAt).format("MMMM D, YYYY "),
    };
  });

  const getAgent = dataAgent.map((e) => ({
    value: e.id,
    label: `${e.first_name}  ${e.last_name ?? ""}`,
  }));
  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
      key: "ticketId",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text, record) => <Link to={`/ticket/${record.key}`}>{text}</Link>
      // <a href={`/ticket/${record.key}`}>{text}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => (
        <>
          <Tag color="processing">{text}</Tag>
        </>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <>
          <Tag color={priority.color}>{priority.name}</Tag>
        </>
        // <>
        //   <Flex align="center" gap="small">
        //     <BsChevronDoubleDown color="green" />
        //     <p>{priority.name}</p>
        //   </Flex>
        //   {/* <Tag color="green">{text}</Tag> */}
        // </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <>
          <Tag color={status.color}>{status.name}</Tag>
        </>
      ),
    },

    ...(user.role !== 3
      ? [
          {
            title: "Requester",
            dataIndex: "requester",
            key: "requester",
            render: (text) => (
              <>
                <Flex align="center" gap="small">
                  <Avatar size="default" icon={<UserOutlined />} />
                  <p>{text}</p>
                </Flex>
              </>
            ),
          },
          {
            title: "Assignee",
            dataIndex: "assignee",
            key: "assignee",
            render: (text, record) => (
              <>
                {text ? (
                  <Flex align="center" gap="small">
                    <Avatar size="default" icon={<UserOutlined />} />
                    <p>{text}</p>
                  </Flex>
                ) : (
                  <Select
                    showSearch
                    placeholder="Select agent to assign"
                    optionFilterProp="label"
                    value={agentSelect}
                    onChange={onChange}
                    // onSearch={onSearch}
                    onSelect={(e) => {
                      showConfirm(record.key, e);
                    }}
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
                )}
              </>
            ),
          },

          {
            title: "Response Duedate",
            dataIndex: "responseDuedate",
            key: "responseDuedate",
            render: (text, record) => (
              <>
                <p
                  style={
                    record.responsePercentage <= 0
                      ? { color: "red" }
                      : record.responsePercentage <= 40
                      ? { color: "orange" }
                      : { color: "green" }
                  }
                >
                  {record.responseDuedate}
                </p>
              </>
            ),
          },
          {
            title: "Resolution Duedate",
            dataIndex: "resolutionDuedate",
            key: "resolutionDuedate",
            render: (text, record) => (
              <>
                <p
                  style={
                    record.resolutionPercentage <= 0
                      ? { color: "red" }
                      : record.resolutionPercentage <= 40
                      ? { color: "orange" }
                      : { color: "green" }
                  }
                >
                  {record.resolutionDuedate}
                </p>
              </>
            ),
          },
        ]
      : []),
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
    },
  ];

  const onChangeCategory = (e) => {
    if (valueCategory === e.target.value) {
      setCategory(null);
    } else {
      setCategory(e.target.value);
    }
  };
  const onChangePriority = (e) => {
    if (valuePriority === e.target.value) {
      setPriority(null);
    } else {
      setPriority(e.target.value);
    }
  };
  const onChangeStatus = (e) => {
    if (valueStatus === e.target.value) {
      setStatus(null);
    } else {
      setStatus(e.target.value);
    }
  };
  const saveFilter = () => {
    console.log(`CATEGORY ID : ${valueCategory}`);
    console.log(`Priority ID : ${valuePriority}`);
    console.log(`Status ID : ${valueStatus}`);
    setTableParams({
      category: valueCategory ?? "",
      priority: valuePriority ?? "",
      status: valueStatus ?? "",
      pagination: {
        ...tableParams.pagination,
        ...tableParams.total,
      },
    });
    console.log("FILTER", tableParams);

    hide();
  };
  const clearFilter = () => {
    setCategory(null);
    setPriority(null);
    setStatus(null);
    setTableParams({
      category: "",
      priority: "",
      status: "",
      pagination: {
        ...tableParams.pagination,
        ...tableParams.total,
      },
    });
    console.log(tableParams);

    hide();
  };
  // const onSearch = (e) => {

  // };

  const content = (
    <div>
      <FilterComponent
        title="Category"
        child={dataDumyCategory}
        isValue={valueCategory}
        onSend={onChangeCategory}
      />

      <FilterComponent
        title="Priority"
        child={dataDumyPriority}
        isValue={valuePriority}
        onSend={onChangePriority}
      />
      <FilterComponent
        title="Status"
        child={dataDumyStatus}
        isValue={valueStatus}
        onSend={onChangeStatus}
      />
      <div style={{ paddingTop: "14px" }}>
        <Flex justify="flex-end" gap="small">
          <Button variant="solid" onClick={clearFilter}>
            Clear
          </Button>
          <Button color="primary" variant="solid" onClick={saveFilter}>
            Save
          </Button>
        </Flex>
      </div>
    </div>
  );
  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    );
  }
  if (isError) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
        />
      </Flex>
    );
  }
  return (
    <>
      <div
        style={{
          paddingBlock: "15px",
          borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        <Flex gap="middle" align="center" style={{ marginLeft: "25px" }}>
          <Input
            placeholder="Search ticket"
            className="custome-input"
            prefix={<LuSearch />}
            style={{ width: "30%" }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Popover
            content={content}
            trigger="click"
            placement="bottomLeft"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Button icon={<LuFilter />} />
          </Popover>
        </Flex>
      </div>
      <div style={{ marginInline: "15px" }}>
        <Table
          columns={columns}
          dataSource={dataParse}
          size="small"
          pagination={tableParams.pagination}
          // onRow={(record, rowIndex) => {
          //   return {
          //     onClick: (event) => {
          //       navigate(`${record.key}`);
          //     },
          //   };
          // }}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
};
export default Ticket;
