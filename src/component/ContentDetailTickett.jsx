import { Avatar, Button, Divider, Flex, Form, Layout, Spin } from "antd";
import { useNavigate } from "react-router";
import { LuSend } from "react-icons/lu";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import ChatBuble from "./ChatBuble";
import TextArea from "antd/es/input/TextArea";
import commentService from "../services/commentServices";
import { MdOutlineArrowBackIos } from "react-icons/md";
const { Header, Content, Footer } = Layout;
const contentStyle = {
  background: "#fff",
  overflowY: "auto",
  height: "100%",
  paddingTop: "12px",
  // msOverflowStyle: "none", // IE/Edge
  // scrollbarWidth: "none",
};
const ContentDetailTicket = ({
  subject,
  comments,
  ticketId,
  refreshTicket,
}) => {
  const navigate = useNavigate();
  const [isLoad, setLoad] = useState(false);
  const [valueComment, setValueComment] = useState();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    const handler = setTimeout(() => {
      // setTableParams({ search: search });
      if (isLoad === false) {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [isLoad]);
  const postComment = async () => {
    try {
      setLoad(true);
      const payload = {
        message: valueComment,
        ticket_id: ticketId,
      };
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);
      const res = await commentService.createComment(
        payload,
        `Bearer ${parsToJson.token}`
      );
      refreshTicket();
      setValueComment();
    } catch (error) {
      console.log("Error Send Comment", error);
    } finally {
      setLoad(false);
    }
  };
  const onFinish = (value) => {
    setValueComment(value.target.value);
  };
  return (
    <>
      <Layout style={{ height: "calc(100vh - 64px)" }}>
        <Header
          style={{
            background: "#fff",
            height: "70px",
            borderBlockEnd: "1px solid rgba(5, 5, 5, 0.06)",
          }}
        >
          <div>
            <Flex align="center" gap="small">
              <Button
                type="text"
                icon={<MdOutlineArrowBackIos />}
                onClick={() => {
                  navigate("/ticket");
                }}
              />
              <h2 style={{ fontWeight: "450", margin: "0px" }}>{subject}</h2>
            </Flex>
          </div>
        </Header>
        <Content
          ref={messagesContainerRef}
          style={contentStyle}
          className="scroll-container"
        >
          {isLoad ? (
            <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </Flex>
          ) : (
            <>
              <div style={{ paddingInline: "24px" }}>
                {/* {Array.from({ length: 10 }, (_, index) => (
              <React.Fragment key={index}>
                <ChatBuble />
              </React.Fragment>
            ))} */}
                {comments.map((e) => (
                  <ChatBuble
                    key={e.id}
                    name={e.user.first_name.concat(" ", e.user.last_name)}
                    message={e.message}
                    createdAt={e.createdAt}
                  />
                ))}
              </div>

              <div ref={messagesEndRef} />
            </>
          )}
        </Content>
        <Footer
          style={{
            background: "#fff",
            borderBlockStart: "1px solid rgba(5, 5, 5, 0.06)",
          }}
        >
          {/* <Form onFinish={onFinish}> */}
          <Flex align="center" gap="middle">
            {/* <Form.Item
                name="comment"
                
                rules={[{ required: true, message: "Please enter comment" }]}
              > */}
            <TextArea
              placeholder="Type your message..."
              autoSize={{ minRows: 1, maxRows: 100 }}
              value={valueComment}
              onChange={onFinish}
            />
            {/* </Form.Item> */}
            {/* <Form.Item> */}
            <Button
              // htmlType="submit"
              type="primary"
              shape="circle"
              size="large"
              onClick={postComment}
              disabled={isLoad}
              icon={<LuSend />}
            />
            {/* </Form.Item> */}
          </Flex>
          {/* </Form> */}
        </Footer>
      </Layout>
    </>
  );
};

export default ContentDetailTicket;
