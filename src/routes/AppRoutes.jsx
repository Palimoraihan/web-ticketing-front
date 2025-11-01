import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../page/home/Home";
import Login from "../page/login/Login";
import Dashboard from "../page/dashboard/Dashboard";
import User from "../page/user/User";
import NotFound from "../page/NotFound";
import Ticket from "../page/ticket/Ticket";
import Register from "../page/register/Register";
import SettingsPage from "../page/settings/Settings";
import MandatoryPage from "../page/mandatory/Mandatory";

import Customer from "../page/customer/Customer";

import DetailTicket from "../page/detail_ticket/DetailTicket";
import Member from "../page/member/Member";
import { notification } from "antd";

const AppRoutes = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = () => {
    api["warning"]({
      message: "Login",
      duration:6,
      description:
        "Your session has expired. Please sign in again.",
    });
  };
  return (
    <>
      {contextHolder}
      <BrowserRouter>
        <Routes>
          <Route element={<Home showNotif={openNotificationWithIcon} />}>
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="ticket" element={<Ticket />} />
            <Route path="ticket/:id" element={<DetailTicket />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route path="mandatory" element={<MandatoryPage />}></Route>
              <Route path="member" element={<Member />}></Route>
              <Route path="customer" element={<Customer />}></Route>
            </Route>
          </Route>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default AppRoutes;
