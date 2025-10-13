import React, { useEffect, useState } from "react";

import ticketService from "../../services/ticketService";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router";
import { Avatar, Button, Card, Flex, Layout, Spin, Tag, Timeline } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import ContentDetailTicket from "../../component/ContentDetailTickett";
import TicketDetailModal from "../../component/TicketDetailModal";
import AssigneeModal from "../../component/AssigneModal";
import dayjs from "dayjs";
import { useAuth } from "../../feature/auth/AuthContext";
const siderStyle = {
  background: "#f5f5f5",
  borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)",
  overflowY: "auto",
  height: "100%",
  paddingInline: "12px",
};
const contentStyle = {
  background: "#fff",
  overflowY: "auto",
  height: "100%",
};
const DetailTicket = () => {
  useEffect(() => {
    fetchDetailTicket();
  }, []);
  let { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [isModal, setModal] = useState(false);
  const [isModalAssign, setModalAssign] = useState(false);
  const [dataTicketDetail, setTicketDetail] = useState();
  const [responsePercentage, setresponsePercentage] = useState();
  const [resolutionPercentage, setResolutionPercentage] = useState();
  const fetchDetailTicket = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);
      const res = await ticketService.getDetailTicket(
        id,
        `Bearer ${parsToJson.token}`
      );
      console.log(res.data);
      setTicketDetail(res.data);
      setresponsePercentage(
        calcPercentageTime(
          res.data.sla_logs[0].response_at,
          res.data.sla_logs[0].response_duedate_at,
          res.data.sla.response_time
        )
      );
      setResolutionPercentage(
        calcPercentageTime(
          res.data.sla_logs[0].resolution_at,
          res.data.sla_logs[0].resolution_duedate_at,
          res.data.sla.resolution_time
        )
      );
    } catch (error) {
      console.log("error detail", error);
    } finally {
      setLoading(false);
    }
  };
  const updateDetailTicket = async (payload) => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);
      setLoading(true);

      const res = await ticketService.updateDetailTicket(
        id,
        payload,
        `Bearer ${parsToJson.token}`
      );
      setModal(false);
      fetchDetailTicket();
    } catch (error) {
      console.log("error detail", error);
    } finally {
      setLoading(false);
    }
  };
  const assignAgentTicket = async (agentId) => {
    try {
      setLoading(true);
      const payload = {
        id: id,
        agent: {
          agent_id: agentId,
        },
      };
      console.log("ASSIGN PAYLOAD", payload);
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);
      const res = await ticketService.assignTicket(
        payload,
        `Bearer ${parsToJson.token}`
      );
      setModalAssign(false);
      fetchDetailTicket();
    } catch (error) {
      console.log("error detail", error);
    } finally {
      setLoading(false);
    }
  };
  const calcPercentageTime = (time, duedate, timeDur) => {
    const now = dayjs();
    const timeAt = time ? dayjs(time) : null;
    const dudateInSec = dayjs(duedate);
    const timeLeft = dudateInSec.diff(timeAt ?? now, "second");
    const timeDuration = timeDur;
    const timePercentage = Math.max(0, (timeLeft / timeDuration) * 100);
    return timePercentage;
  };
  const onModal = () => {
    setModal(!isModal);
  };
  const onModalAssign = () => {
    setModalAssign(!isModalAssign);
  };
  const onFinish = (val) => {
    const paylaod = {};
    if (val.category2) paylaod.category_id = val.category2;
    if (val.priority2) paylaod.priority_id = val.priority2;
    if (val.status2) paylaod.status_id = val.status2;
    updateDetailTicket(paylaod);
  };
  const refreshTicket = () => {
    fetchDetailTicket();
  };
  const onFinishAssgn = async (value) => {
    console.log(value);
    await assignAgentTicket(value.assignee);
  };
  if (isLoading) {
    return (
      <>
        <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      </>
    );
  }

  return (
    <>
      <AssigneeModal
        isModal={isModalAssign}
        onCancel={onModalAssign}
        onFinish={onFinishAssgn}
      />
      <TicketDetailModal
        statusId={dataTicketDetail.status_id}
        categoryId={dataTicketDetail.category_id}
        priorityId={dataTicketDetail.priority_id}
        isModal={isModal}
        onCancel={onModal}
        onFinish={onFinish}
      />

      <Layout style={{ height: "calc(100vh - 64px)" }}>
        <Content style={contentStyle}>
          <ContentDetailTicket
            subject={`#TD-${dataTicketDetail.id} ${dataTicketDetail.subject}`}
            comments={dataTicketDetail.comments}
            ticketId={dataTicketDetail.id}
            refreshTicket={refreshTicket}
          />
        </Content>
        <Sider width="25%" style={siderStyle}>
          <div style={{ paddingTop: "14px" }}>
            <Flex vertical align="center" style={{ paddingBottom: "12px" }}>
              <Avatar size="large" icon={<UserOutlined />} />
              <h2 style={{ margin: "0px" }}>
                {dataTicketDetail.user.first_name.concat(
                  " ",
                  dataTicketDetail.user.last_name
                )}
              </h2>
              <p style={{ margin: "0px", fontSize: "16px" }}>
                {dataTicketDetail.user.email}
              </p>
            </Flex>
            <Flex gap="middle" vertical>
              <Card style={{ padding: "0px" }}>
                <Flex vertical gap="middle">
                  <Flex justify="space-between">
                    <h3 style={{ margin: "0px" }}>Assignee</h3>
                    {dataTicketDetail.agent || user.role === 3 ? (
                      <></>
                    ) : (
                      <Button
                        color="primary"
                        variant="link"
                        onClick={onModalAssign}
                      >
                        {" "}
                        Assign
                      </Button>
                    )}
                  </Flex>
                  {dataTicketDetail.agent && (
                    <Flex
                      align="center"
                      gap="middle"
                      style={{ paddingBottom: "12px" }}
                    >
                      <Avatar size="large" icon={<UserOutlined />} />
                      <Flex vertical>
                        <h4 style={{ margin: "0px" }}>
                          {dataTicketDetail.agent.first_name.concat(
                            " ",
                            dataTicketDetail.agent.last_name
                          )}
                        </h4>
                        <p style={{ margin: "0px" }}>
                          {dataTicketDetail.user.email}
                        </p>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Card>
              <Card>
                <Flex vertical gap="middle">
                  <Flex justify="space-between">
                    <h3 style={{ margin: "0px" }}>Ticket Detail</h3>
                    {dataTicketDetail.status.id !== 17 || user.role !== 3 ? (
                      <Button color="primary" variant="link" onClick={onModal}>
                        {" "}
                        Change
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Flex>
                  <Flex vertical gap="small">
                    <Flex align="center" gap="small">
                      <p style={{ margin: "0px" }}>Category :</p>
                      <Tag color="blue">{dataTicketDetail.category.name}</Tag>
                    </Flex>
                    <Flex align="center" gap="small">
                      <p style={{ margin: "0px" }}>Priority :</p>
                      <Tag color={dataTicketDetail.priority.color}>
                        {dataTicketDetail.priority.name}
                      </Tag>
                    </Flex>
                    <Flex align="center" gap="small">
                      <p style={{ margin: "0px" }}>Status :</p>
                      <h4 style={{ margin: "0px", fontWeight: "500" }}>
                        <Tag color={dataTicketDetail.status.color}>
                          {dataTicketDetail.status.name}
                        </Tag>
                      </h4>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
              {user.role !== 3 && (
                <>
                  <Card>
                    <Flex vertical gap="middle">
                      <h3 style={{ margin: "0px" }}>Response Time</h3>
                      <Flex vertical gap="small">
                        <Flex align="center" gap="small">
                          <p style={{ margin: "0px" }}>Due Date :</p>
                          <h4
                            style={{
                              margin: "0px",
                              fontWeight: "500",
                              color:
                                responsePercentage <= 0
                                  ? "red"
                                  : responsePercentage <= 40
                                  ? "orange"
                                  : "green",
                            }}
                          >
                            {dayjs(
                              dataTicketDetail.sla_logs[0].response_duedate_at
                            ).format("MMMM D, YYYY h:mm A")}
                          </h4>
                        </Flex>
                        <Flex align="center" gap="small">
                          <p style={{ margin: "0px" }}>Response At :</p>
                          <h4
                            style={{
                              margin: "0px",
                              fontWeight: "500",
                              color: dataTicketDetail.sla_logs[0].response_at
                                ? responsePercentage <= 0
                                  ? "red"
                                  : responsePercentage <= 40
                                  ? "orange"
                                  : "green"
                                : "",
                            }}
                          >
                            {dataTicketDetail.sla_logs[0].response_at
                              ? dayjs(
                                  dataTicketDetail.sla_logs[0].response_at
                                ).format("MMMM D, YYYY h:mm A")
                              : "-"}
                          </h4>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                  <Card>
                    <Flex vertical gap="middle">
                      <h3 style={{ margin: "0px" }}>Resolution Time</h3>
                      <Flex vertical gap="small">
                        <Flex align="center" gap="small">
                          <p style={{ margin: "0px" }}>Due Date :</p>
                          <h4
                            style={{
                              margin: "0px",
                              fontWeight: "500",
                              color:
                                resolutionPercentage <= 0
                                  ? "red"
                                  : resolutionPercentage <= 40
                                  ? "orange"
                                  : "green",
                            }}
                          >
                            {dayjs(
                              dataTicketDetail.sla_logs[0].resolution_duedate_at
                            ).format("MMMM D, YYYY h:mm A")}
                          </h4>
                        </Flex>
                        <Flex align="center" gap="small">
                          <p style={{ margin: "0px" }}>Resolution At :</p>
                          <h4
                            style={{
                              margin: "0px",
                              fontWeight: "500",
                              color: dataTicketDetail.sla_logs[0].resolution_at
                                ? resolutionPercentage <= 0
                                  ? "red"
                                  : resolutionPercentage <= 40
                                  ? "orange"
                                  : "green"
                                : "",
                            }}
                          >
                            {dataTicketDetail.sla_logs[0].resolution_at
                              ? dayjs(
                                  dataTicketDetail.sla_logs[0].resolution_at
                                ).format("MMMM D, YYYY h:mm A")
                              : "-"}
                          </h4>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                </>
              )}
            </Flex>
          </div>
        </Sider>
      </Layout>
    </>
  );
};

export default DetailTicket;
