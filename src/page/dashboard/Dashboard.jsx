import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
const { Option } = Select;
const PriceInput = (props) => {
  const { id, value = {}, onChange } = props;
  const [numbere, setNumber] = useState(0);
  const [currency, setCurrency] = useState("rmb");
  const triggerChange = (changedValue) => {
    onChange?.({ numbere, currency, ...value, ...changedValue });
  };
  const onNumberChange = (e) => {
    const newNumber = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(numbere)) {
      return;
    }
    if (!("numbere" in value)) {
      setNumber(newNumber);
    }
    triggerChange({ numbere: newNumber });
  };
  const onCurrencyChange = (newCurrency) => {
    if (!("currency" in value)) {
      setCurrency(newCurrency);
    }
    triggerChange({ currency: newCurrency });
  };
  return (
    <span id={id}>
      <Input
        type="text"
        value={value.numbere || numbere}
        onChange={onNumberChange}
        style={{ width: 100 }}
      />
      <Select
        value={value.currency || currency}
        style={{ width: 80, margin: "0 8px" }}
        onChange={onCurrencyChange}
      >
        <Option value="rmb">RMB</Option>
        <Option value="dollar">Dollar</Option>
      </Select>
    </span>
  );
};
const Dashboard = () => {
  const onFinish = (values) => {
    console.log("Received values from form: ", values);
  };
  const checkPrice = (_, value) => {
    if (value.numbere > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Price must be greater than zero!"));
  };
  return (
    <Form
      name="customized_form_controls"
      layout="inline"
      onFinish={onFinish}
      initialValues={{
        price: {
          numbere: 0,
          currency: "rmb",
        },
      }}
    >
      <Form.Item name="price" label="Price" rules={[{ validator: checkPrice }]}>
        <PriceInput />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Dashboard;
