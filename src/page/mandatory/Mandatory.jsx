import { Layout, Menu, Segmented } from "antd";
import { MdOutlinePriorityHigh, MdCategory } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { useState } from "react";
import CategoryPage from "./category/Category";
import PriorityPage from "./priority/Priority";
import StatusPage from "./status/StatusPage";

const { Header, Content } = Layout;
const items = [
  {
    value: 1,
    label: "Status",
    icon: <GrStatusGood />,
  },
  {
    value: 2,
    label: "Priority",
    icon: <MdOutlinePriorityHigh />,
    // disabled: true,
  },
  {
    value: 3,
    label: "Category",
    icon: <MdCategory />,
    // disabled: true,
  },
];

const MandatoryPage = () => {
  const [selected, setSelected] = useState();
  const onChange = (val) => {
    setSelected(val);
  };
  const ContentItem = () => {
    switch (selected) {
      case 3:
        return <CategoryPage />;
      case 2:
        return <PriorityPage/>;
      default:
        return <StatusPage />;
    }
  };
  return (
    <>
      <Layout style={{ background: "transparent" }}>
        <Header style={{ background: "transparent", padding: "0px" }}>
          {/* <Menu mode="horizontal" items={items} /> */}
          <Segmented size="large" options={items} onChange={onChange} />
        </Header>
        <Content>
          <div style={{ paddingLeft: "14px" }}>
            
            <ContentItem/>
          </div>
        </Content>
      </Layout>
    </>
  );
};
export default MandatoryPage;
