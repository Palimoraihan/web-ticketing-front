import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router";

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = [
    <Breadcrumb.Item key="dashboard">
      <Link to="/dashboard">Home</Link>
    </Breadcrumb.Item>,
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const label = pathSnippets[index]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{label}</Link>
        </Breadcrumb.Item>
      );
    }),
  ];

  return (
    
    <Breadcrumb style={{ marginBottom: 16 }}>{breadcrumbItems}</Breadcrumb>
  );
};
export default BreadcrumbNav;