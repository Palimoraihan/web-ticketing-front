import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Outlet, useLocation } from "react-router";

const SettingsPage = () => {
  const location = useLocation();
  const CheckNav = ({ margin }) => {
    switch (location.pathname) {
      case "/settings/mandatory":
        return (
          <div>
            <h1 style={{ margin: margin }}>Mandatory</h1>
            <p>Manage and settings your mandatory app </p>
          </div>
        );
      case "/settings/member":
        break;
      case "/settings/customer":
        break;
      default:
        return <h2 style={{ margin: margin }}>Settings</h2>;
    }
  };
  return (
    <>
      <div style={{ paddingBlock: "15px", marginInline: "15px" }}>
        <CheckNav />
        <Outlet />
      </div>
    </>
  );
};

export default SettingsPage;
