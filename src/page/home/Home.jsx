import { Outlet, useNavigate, useLocation, useParams } from "react-router";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { BiLogOutCircle } from "react-icons/bi";
import {
  Input,
  Menu,
  Flex,
  Button,
  Layout,
  Avatar,
  Typography,
  Spin,
  notification,
} from "antd";

import logo from "../../assets/CoreDesk-crop.png";
import categoryService from "../../services/categoryService";
import userService from "../../services/userService";
import {
  LuLayoutDashboard,
  LuTicket,
  LuSettings,
  LuFileSliders,
  LuUserRound,
} from "react-icons/lu";
import { MdSupportAgent } from "react-icons/md";

import BreadcrumbNav from "../../component/BreatcrumNav";
import { use, useEffect, useState } from "react";
import DrawerTicket from "../../component/DrawerTicket";
import { useAuth } from "../../feature/auth/AuthContext";
const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;
const Home = ({ showNotif }) => {
  // const { user } = useAuth();
  const { user, logout } = useAuth();
  useEffect(() => {
    console.log(user);

    authCheck();
    getProfile();
  }, []);
  const navigate = useNavigate();
  let { id } = useParams();
  const location = useLocation();
  const [userrs, setUser] = useState();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [dataCategory, setCategory] = useState([]);
  const [dataCutomer, setCustomer] = useState([]);
  const [dataAgent, setAgent] = useState([]);
  // const items = [
  //   // {
  //   //   key: "/dashboard",
  //   //   label: "Dashboard",
  //   //   icon: <LuLayoutDashboard />,
  //   // },
  //   {
  //     key: "/ticket",
  //     label: "Ticket",
  //     icon: <LuTicket />,
  //   },
  //   ...[
  //     {
  //       key: "/settings",
  //       label: "Settings",
  //       icon: <LuSettings />,
  //       children: [
  //         {
  //           key: "/settings/mandatory",
  //           label: "Mandatory",
  //           icon: <LuFileSliders />,
  //         },
  //         {
  //           key: "/settings/member",
  //           label: "Member",
  //           icon: <MdSupportAgent />,
  //         },
  //         {
  //           key: "/settings/customer",
  //           label: "Customer",
  //           icon: <LuUserRound />,
  //         },
  //       ],
  //     },
  //   ],
  // ];

  const showDrawer = () => {
    setOpen(true);
    fetchCategory();
  };
  const onClose = () => {
    setOpen(false);
    setLoading(false);
    setCategory([]);
    setCustomer([]);
  };
  const getProfile = () => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);

    const parsToJson = JSON.parse(storedUser);
    const myName = parsToJson.first_name.concat(" ", parsToJson.last_name);
    const userData = {
      name: myName,
      role: parsToJson.role,
    };

    setUser(userData);
  };
  const fetchCategory = async () => {
    try {
      const res = await categoryService.getCategory();
      setCategory(res.data);
      console.log("GETDATA CATEGORY", res);
    } catch (error) {
      console.log("Category Error", error);
    } finally {
      fetchCustomer();
      // setLoading(false);
    }
  };
  const authCheck = async () => {
    try {
      // setLoading(true);
      const storedUser = localStorage.getItem("user");
      const parsToJson = JSON.parse(storedUser);
      console.log("Token", parsToJson.token);

      await userService.getAuthCheck(`Bearer ${parsToJson.token}`);
    } catch (error) {
      console.log(error);

      showNotif();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomer = async () => {
    try {
      const res = await userService.getCustomer();
      setCustomer(res.data);
    } catch (error) {
      console.log("Customer Error", error);
    } finally {
      fetchAgent();
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
  const onClick = (e) => {
    switch (e.key) {
      case "/dashboard":
        navigate("/dashboard");
        break;
      case "/ticket":
        navigate("/ticket");
        break;
      case "/settings":
        navigate("/settings");
        break;
      case "/settings/mandatory":
        navigate("/settings/mandatory");
        break;
      case "/settings/member":
        navigate("/settings/member");
        break;
      case "/settings/customer":
        navigate("/settings/customer");
        break;
      default:
        break;
    }
  };
  const CheckNav = ({ margin }) => {
    switch (location.pathname) {
      case "/dashboard":
        return <h2 style={{ margin: margin }}>Dashboard</h2>;
      case "/ticket":
        return <h2 style={{ margin: margin }}>Ticket</h2>;
      case `/ticket/${id}`:
        return <h2 style={{ margin: margin }}>Ticket</h2>;
      case "/settings":
        return <h2 style={{ margin: margin }}>Settings</h2>;
      default:
        return <h2 style={{ margin: margin }}>Settings</h2>;
    }
  };
  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100%" }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    );
  }

  return (
    <>
      <Layout hasSider>
        <Sider
          style={{
            background: "#f9f9f9",
            height: "100vh",
            borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)",
            position: "sticky",
            overflow: "auto",
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",
          }}
        >
          <div
            style={{
              paddingLeft: "15px",
              height: "64px",
              alignContent: "center",
              borderBlockEnd: "1px solid rgba(5, 5, 5, 0.06)",
            }}
          >
            <Flex justify="flex-start" align="center">
              <Avatar shape="square" size="large" icon={<UserOutlined />} />
              <div style={{ paddingLeft: "8px" }}>
                <h4>{userrs.name}</h4>
              </div>
            </Flex>
          </div>
          <div style={{ marginTop: "24px" }}>
            <Flex
              vertical
              justify="space-between"
              style={{
                height: "calc(100vh - 90px)",
                paddingInline: "8px",
                paddingBottom: "8px",
              }}
            >
              <Menu
                onClick={onClick}
                style={{ border: "none", background: "#f9f9f9" }}
                defaultSelectedKeys={[location.pathname]}
                mode="vertical"
                items={[
                  // {
                  //   key: "/dashboard",
                  //   label: "Dashboard",
                  //   icon: <LuLayoutDashboard />,
                  // },
                  {
                    key: "/ticket",
                    label: "Ticket",
                    icon: <LuTicket />,
                  },
                  ...(user.role!==3?[
                    {
                      key: "/settings",
                      label: "Settings",
                      icon: <LuSettings />,
                      children: [
                        {
                          key: "/settings/mandatory",
                          label: "Mandatory",
                          icon: <LuFileSliders />,
                        },
                        {
                          key: "/settings/member",
                          label: "Member",
                          icon: <MdSupportAgent />,
                        },
                        {
                          key: "/settings/customer",
                          label: "Customer",
                          icon: <LuUserRound />,
                        },
                      ],
                    },
                  ]:[]),
                ]}
              />

              <Button
                type="primary"
                icon={<BiLogOutCircle />}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </Flex>
          </div>
        </Sider>
        <Layout>
          <Header
            style={{
              background: "#ffffff",
              borderBlockEnd: "1px solid rgba(5, 5, 5, 0.06)",
              paddingInlineStart: "25px",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <Flex align="center" justify="space-between">
              <CheckNav margin="0px" />
              {(location.pathname === "/ticket" ||
                location.pathname === `/ticket/${id}`) && (
                <Button onClick={showDrawer} color="primary" variant="solid">
                  New Ticket
                </Button>
              )}
              <DrawerTicket
                isOpen={open}
                onClose={onClose}
                isLoading={isLoading}
                dataCategory={dataCategory}
                dataCustomer={dataCutomer}
                dataAgent={dataAgent}
              />
            </Flex>
          </Header>
          <Content style={{ background: "#ffffff" }}>
            {/* <div style={{ marginLeft: "25px" }}> */}
            <Outlet />
            {/* </div> */}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default Home;
