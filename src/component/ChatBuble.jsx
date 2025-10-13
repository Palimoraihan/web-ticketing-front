import { Avatar, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const ChatBuble = ({name,message,createdAt}) => {
  return (
    <>
      <div
        style={{
          border: "1px solid#D3D3D3FF",
          borderRadius: "8px",
          paddingInline: "50px",
          marginBottom: "16px",
        }}
      >
        <Flex justify="space-between">
          <Flex align="center" gap="small">
            <Avatar size="default" icon={<UserOutlined />} />
            <p style={{ margin: "0px" }}>{name}</p>
          </Flex>
          <p>{dayjs(createdAt).format("MMMM D, YYYY h:mm A")}</p>
        </Flex>
        <p>
          {message}
        </p>
      </div>
    </>
  );
};
export default ChatBuble;
