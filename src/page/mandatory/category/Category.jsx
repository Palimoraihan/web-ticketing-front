import { Button, Flex, Table, Alert, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import {QuestionCircleOutlined} from "@ant-design/icons"
import categoryService from "../../../services/categoryService";
import CategoryModal from "../../../component/CategoryModal";
import { LuPencil, LuTrash2 } from "react-icons/lu";
const CategoryPage = () => {
  useEffect(() => {
    // mergeAll();
    getDataCategoryApi();
  }, []);
  const [datasAll, setDatasAll] = useState([]);
  const [dataCategoryId, setDataCategoryId] = useState();
  const [isModal, setModal] = useState(false);
  const [isWarning, setWarning] = useState();
  const getDataCategoryApi = async () => {
    try {
      const res = await categoryService.getCategory();
      mergeAll(res.data);
    } catch (error) {
      console.log("SOMETHING WORNG", error);
    }
  };
  const getDataCategoryById = async (id) => {
    try {
      const res = await categoryService.getCategoryById(id);
      setDataCategoryId(res.data);

      console.log(res.data);
    } catch (error) {
      console.log("GET CATEGORY BY ID ERROR", error);
    }
  };
  const onModalOpen = (categoryId) => {
    setModal(!isModal);
    console.log("MODAL TRIGER", isModal);
    console.log("MODAL  DATA", categoryId);
    if (categoryId != undefined) {
      getDataCategoryById(categoryId);
    }
    if (isModal === true) {
      setDataCategoryId(null);
    }
  };
  const convertSecond = (second) => {
    const days = Math.floor(second / (24 * 3600));
    second %= 24 * 3600;
    const hour = Math.floor(second / (60 * 60));
    second %= 60 * 60;
    const minutes = Math.floor(second / 60);
    second %= 60;

    const responseConvert = `${days != 0 ? `${days}d ` : ""}${
      hour != 0 ? `${hour}h ` : ""
    }${minutes != 0 ? `${minutes}m ` : ""}`;
    return responseConvert;
  };
  const columns = [
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category",
      onCell: (row, index) => {
        return row.isAllowedRow
          ? { rowSpan: row.total_priority }
          : { rowSpan: 0 };
      },
    },
    {
      title: "Priority",
      dataIndex: "priority_name",
      key: "priority",
    },
    {
      title: "Service Level Agrement (SLA)",
      children: [
        {
          title: "Response Time",
          dataIndex: "response_time",
          key: "response_time",
        },
        {
          title: "Resolution Time",
          dataIndex: "resolution_time",
          key: "resolution_time",
        },
      ],
    },
    {
      title: "Action",
      key: "action",
      onCell: (row, index) => {
        return row.isAllowedRow
          ? { rowSpan: row.total_priority }
          : { rowSpan: 0 };
      },
      render: (text, record) => (
        <>
          <Button
            shape="default"
            type="text"
            color="primary"
            variant="text"
            icon={<LuPencil />}
            onClick={() => {
              // showModal(true, record);
              console.log("RECORD", record);

              onModalOpen(record.category_id ?? null);
            }}
          />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              shape="default"
              type="text"
              color="danger"
              variant="text"
              icon={<LuTrash2 />}
              onClick={() => {
                // deleteData(record.key);
              }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];
  const mergeAll = (dataCategory) => {
    let lastCategoryId = null;
    let indexCounter = 0;

    const mergedData = dataCategory.flatMap((category) => {
      const totalPriority = category.sla.length;

      return category.sla.map((priority) => {
        const isNewCategory = lastCategoryId !== priority.category_id;
        lastCategoryId = priority.category_id;
        const getTimeResponse = convertSecond(priority.response_time);
        const getTimeResolution = convertSecond(priority.resolution_time);
        return {
          key: ++indexCounter,
          category_id: priority.category_id,
          category_name: category.name,
          priority_id: priority.priority.id,
          priority_name: priority.priority.name,
          isAllowedRow: isNewCategory,
          total_priority: totalPriority,
          response_time: getTimeResponse,
          resolution_time: getTimeResolution,
        };
      });
    });

    setDatasAll(mergedData);
  };
  const getWarning = (isWarnings) => {
    console.log("ISWARNING", isWarnings);
    setWarning(isWarnings);
  };
  return (
    <>
      <CategoryModal
        isModalOpen={isModal}
        titleModal={"New Category"}
        onCancel={onModalOpen}
        onDone={getDataCategoryApi}
        categoryData={dataCategoryId ?? null}
        warningFunc={getWarning}
      />
      {isWarning && (
        <div style={{ paddingBottom: "12px" }}>
          <Alert
            banner
            message={isWarning}
            type="warning"
            onClose={() => getWarning()}
            closable
          />
        </div>
      )}
      <div>
        <Flex justify="space-between" align="center">
          <div>
            <h1>Category</h1>
            <p>Manage your category with sla </p>
          </div>
          <Button
            color="primary"
            variant="solid"
            onClick={() => onModalOpen(null)}
          >
            {" "}
            New Category
          </Button>
        </Flex>
      </div>

      <div>
        <Table bordered dataSource={datasAll} columns={columns} />
      </div>
    </>
  );
};
export default CategoryPage;
