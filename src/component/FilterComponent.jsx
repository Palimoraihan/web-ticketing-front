import { Flex, Typography, Checkbox, Row, Col } from "antd";
const { Text } = Typography;

const FilterComponent = ({ title, child, isValue, onSend }) => {
  const onChange = (e) => {
    onSend(e);
  };
  return (
    <div style={{ paddingBottom: "14px",}}>
      <div style={{ paddingBottom: "8px" }}>
        <Text type="secondary" style={{ fontSize: "14px", fontWeight: "bold" }}>
          {title}
        </Text>
      </div>
      <Row>
        {child.map((e) => {
          return (
            <Col span={8}>
            
            <Checkbox key={e.id}
              checked={isValue === e.id ? true : false}
              value={e.id}
              onChange={onChange}
            >
              {e.name}
            </Checkbox>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default FilterComponent;
