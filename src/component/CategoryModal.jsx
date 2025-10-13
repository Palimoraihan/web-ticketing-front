import {
  Modal,
  Form,
  Input,
  Checkbox,
  Flex,
  DatePicker,
  TimePicker,
  Alert,
  InputNumber,
} from "antd";
import messageError from "../comont/messageError.json";
import { useEffect } from "react";
import { useState, useMemo } from "react";
import priorityService from "../services/priorityServices";
import categoryService from "../services/categoryService";

const TimeInput = (props) => {
  const { id, value = {}, onChange } = props;
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const triggerChange = (changedValue) => {
    onChange?.({ day, hour, minute, second, ...value, ...changedValue });
  };
  const onDayChange = (e) => {
    const newDay = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(day)) {
      return;
    }
    if (!("day" in value)) {
      setDay(newDay);
    }
    triggerChange({ day: newDay });
  };
  const onHourChange = (e) => {
    const newHour = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(hour)) {
      return;
    }
    if (!("hour" in value)) {
      setHour(newHour);
    }
    triggerChange({ hour: newHour });
  };
  const onMinuteChange = (e) => {
    const newMinute = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(minute)) {
      return;
    }
    if (!("minute" in value)) {
      setMinute(newMinute);
    }
    triggerChange({ minute: newMinute });
  };
  const onSecondChange = (e) => {
    const newSecond = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(second)) {
      return;
    }
    if (!("second" in value)) {
      setSecond(newSecond);
    }
    triggerChange({ second: newSecond });
  };
  return (
    <Flex id={id} gap="small" style={{ width: "100%" }}>
      <div>
        <p style={{ padding: "0", margin: "0" }}>D :</p>
        <Input
          type="text"
          value={value.day || day}
          onChange={onDayChange}
          style={{ width: 50 }}
        />
      </div>
      <div>
        <p style={{ padding: "0", margin: "0" }}>H :</p>
        <Input
          type="text"
          value={value.hour || hour}
          onChange={onHourChange}
          style={{ width: 50 }}
        />
      </div>
      <div>
        <p style={{ padding: "0", margin: "0" }}>M :</p>
        <Input
          type="text"
          value={value.minute || minute}
          onChange={onMinuteChange}
          style={{ width: 50 }}
        />
      </div>
      <div>
        <p style={{ padding: "0", margin: "0" }}>S :</p>
        <Input
          type="text"
          value={value.second || second}
          onChange={onSecondChange}
          style={{ width: 50 }}
        />
      </div>
    </Flex>
  );
};
const CategoryModal = ({
  titleModal,
  isModalOpen,
  onCancel,
  onDone,
  // onFinish,
  warningFunc,
  categoryData,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    // console.log("LOAD PAGE MODAL CATEGORY");
    getData();
  }, [categoryData]);
  const [getDataPriority, setDataPriority] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [isLoadForm, setLoadForm] = useState(false);
  const [isError, setError] = useState();
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [sladata, setSlaData] = useState([]);
  const getData = async () => {
    try {
      const res = await priorityService.getPriority();
      const optionsSet = res.data.map((item) => ({
        label: item.name,
        value: item.id, // gunakan id langsung, bukan string JSON
        // className: item.className,
      }));
      setDataPriority(optionsSet);
      initForm();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const initForm = () => {
    if (categoryData) {
      // ambil priority id yg aktif dari SLA
      const selected = categoryData.sla.map((s) => s.priority_id);
      const slaId = categoryData.sla.map((s) => ({
        slaId: s.id,
        priorityId: s.priority_id,
      }));
      setSelectedPriorities(selected);
      setSlaData(slaId);

      // mapping ke initial value untuk TimeInput
      const initVal = {};
      categoryData.sla.forEach((s) => {
        initVal[`${s.priority_id}_responseTime`] = convertSecondToObj(
          s.response_time
        );
        initVal[`${s.priority_id}_resolutionTime`] = convertSecondToObj(
          s.resolution_time
        );
      });

      form.setFieldsValue({
        name: categoryData.name,
        checkboxGroup: selected,
        ...initVal,
      });
    }
  };
  const convertSecondToObj = (seconds) => {
    const day = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hour = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return { day, hour, minute, second };
  };

  const uploadPriority = async (payload) => {
    try {
      setLoadForm(true);
      if (categoryData) {
        const res = await categoryService.updateCategory(
          categoryData.id,
          payload
        );
        if (res.warning) {
          warningFunc(res.warning);
        } else {
          warningFunc(null);
        }
        console.log(res);
      } else {
        await categoryService.createCategory(payload);
      }
      onCancel();
      onDone();
    } catch (error) {
      console.log(error);

      let errorMessage;
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data.error;
            break;
          case 409:
            errorMessage = messageError.resource.alredy.message.replace(
              "{field}",
              "name"
            );
            break;
          default:
            errorMessage = messageError.server.internal_error.message;
            break;
        }
      } else {
        errorMessage = error;
      }
      setError(errorMessage);
    } finally {
      setLoadForm(false);
    }
  };
  const handleCheckboxChange = (checkedValues) => {
    setSelectedPriorities(checkedValues);
  };

  const selectedOptions = useMemo(
    () =>
      getDataPriority.filter((opt) => selectedPriorities.includes(opt.value)),
    [selectedPriorities]
  );

  const onFinishhh = (valueIn) => {
    console.log("DONE CATEGORY", valueIn);
    const hourToSecond = 3600;
    const dayToSecond = 24 * hourToSecond;
    const minuteToSecond = 60;
    let dataSaved = [];
    selectedPriorities.map((value) => {
      const responseVal = valueIn[`${value}_responseTime`];
      const resolutionVal = valueIn[`${value}_resolutionTime`];
      // RESPONSE TIME
      const getResponsDayToSec = responseVal.day * dayToSecond;
      const getResponsHourToSec = responseVal.hour * hourToSecond;
      const getResponsMinToSec = responseVal.minute * minuteToSecond;
      const getResponsSec = responseVal.second;

      const calculateResponse =
        getResponsDayToSec +
        getResponsHourToSec +
        getResponsMinToSec +
        getResponsSec;

      // RESOLUTION TIME
      const getResolutionDayToSec = resolutionVal.day * dayToSecond;
      const getResolutionHourToSec = resolutionVal.hour * hourToSecond;
      const getResolutionMinToSec = resolutionVal.minute * minuteToSecond;
      const getResolutionSec = resolutionVal.second;

      const calculateResolution =
        getResolutionDayToSec +
        getResolutionHourToSec +
        getResolutionMinToSec +
        getResolutionSec;
      let mapingData;
      if (categoryData) {
        let idSla = sladata.find((item) => item.priorityId === value);

        mapingData = {
          priority_id: value,
          response_time: calculateResponse,
          resolution_time: calculateResolution,
        };
        if (idSla) mapingData.id = idSla.slaId;
      } else {
        mapingData = {
          priority_id: value,
          response_time: calculateResponse,
          resolution_time: calculateResolution,
        };
      }
      dataSaved.push(mapingData);
    });
    const payload = {
      name: valueIn.name,
      slas: dataSaved,
    };
    uploadPriority(payload);
  };
  const onCanceled = () => {
    onCancel();
    setError();
    setSelectedPriorities([]);
  };
  return (
    <Modal
      centered
      destroyOnHidden
      title={categoryData ? "Update Category" : titleModal}
      open={isModalOpen}
      confirmLoading={isLoadForm}
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      onCancel={onCanceled}
      modalRender={(dom) => (
        <>
          <Form
            form={form}
            layout="vertical"
            name="category"
            clearOnDestroy
            onFinish={onFinishhh}
          >
            {dom}
          </Form>
        </>
      )}
    >
      {isError && (
        <div style={{ paddingBottom: "14px" }}>
          <Alert description={isError} type="error" closable />
        </div>
      )}
      <Form.Item
        name="name"
        label="Category Name"
        // initialValue={categoryData?.name}
        rules={[{ required: true, message: "Please input category name!" }]}
      >
        <Input placeholder="Please input category name" />
      </Form.Item>

      <Form.Item
        name="checkboxGroup"
        label="Select Priority"
        // initialValue={}
        rules={[{ required: true, message: "Please select priority!" }]}
      >
        <Checkbox.Group
          options={getDataPriority}
          onChange={handleCheckboxChange}
        />
      </Form.Item>

      {selectedOptions.length > 0 && (
        <div>
          <p>Setting your SLA:</p>
          {selectedOptions.map(({ value, label }) => (
            <div key={value}>
              <h5>{label}</h5>
              <Flex gap="small">
                <Form.Item
                  name={`${value}_responseTime`}
                  label="Response Time"
                  style={{ flex: 1 }}
                  rules={[
                    { required: true, message: "Please input response time!" },
                  ]}
                >
                  {/* <Input placeholder="Please input response time" /> */}
                  {/* <TimePicker /> */}
                  {/* <InputNumber addonAfter="Minute" /> */}
                  <TimeInput />
                </Form.Item>

                <Form.Item
                  name={`${value}_resolutionTime`}
                  label="Resolution Time"
                  style={{ flex: 1 }}
                  rules={[
                    {
                      required: true,
                      message: "Please input resolution time!",
                    },
                  ]}
                >
                  {/* <TimePicker /> */}
                  <TimeInput />
                </Form.Item>
              </Flex>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default CategoryModal;
