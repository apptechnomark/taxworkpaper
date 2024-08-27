import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { TablePagination, ThemeProvider, Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { Delete, Edit } from "@mui/icons-material";
import DeleteDialog from "../common/DeleteDialog";
import { toast } from "react-toastify";
import { getMuiTheme } from "tsconfig.json/utils/CommonStyle`";
import { callAPI } from "tsconfig.json/utils/API/callAPI`";
import {
  generateCommonBodyRender,
  generateCustomColumn,
  generateCustomHeaderName,
} from "tsconfig.json/utils/CommonTableFunction`";

const pageNo = 1;
const pageSize = 10;

const initialFilter = {
  page: pageNo,
  limit: pageSize,
  search: "",
  formType: "",
};

interface Interface {
  page: number;
  limit: number;
  search: string;
  formType: string | null;
}

interface List {
  id: number;
  formType: string;
  fullName: string;
  email: string;
  phone: number | string;
  organizationName: string;
  projectDescription: string | null;
  date: string;
}

const FormDatatable = ({ data, setData, setOpenDrawer, setEditId }: any) => {
  const [loaded, setLoaded] = useState<boolean>(true);
  const [filteredObject, setFilteredOject] = useState<Interface>(initialFilter);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const getFormList = async () => {
    setLoaded(false);
    const params = filteredObject;
    const url = `${process.env.baseURL}/form/getFormList`;
    const successCallback = (
      ResponseData: {
        list: List[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
      },
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        setLoaded(true);
        setData(ResponseData.list);
        setTableDataCount(ResponseData.totalCount);
      } else {
        setLoaded(true);
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await getFormList();
  //   };
  //   const timer = setTimeout(() => {
  //     fetchData();
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [filteredObject]);

  const columnConfig = [
    {
      name: "id",
      label: "ID",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "form",
      label: "Form Name",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "fieldName",
      label: "Field Name",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "color",
      label: "Highlight Color",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "comments",
      label: "Comments",
      bodyRenderer: generateCommonBodyRender,
    },
    {
      name: "id",
      label: "Action",
      bodyRenderer: generateCommonBodyRender,
    },
  ];

  const generateConditionalColumn = (column: {
    name: string;
    label: string;
    bodyRenderer: (arg0: any) => any;
  }) => {
    if (column.label === "Action") {
      return {
        name: "id",
        options: {
          filter: true,
          sort: true,
          customHeadLabelRender: () => generateCustomHeaderName("Action"),
          customBodyRender: (value: number) => {
            return (
              <div className="flex items-center justify-start gap-4">
                <div
                  onClick={() => {
                    setOpenDrawer(true);
                    setEditId(value);
                  }}
                >
                  <Tooltip title={"Edit"} placement="top" arrow>
                    <Edit />
                  </Tooltip>
                </div>
                <div
                  onClick={() => {
                    setDeleteOpen(true);
                    setDeleteId(value);
                  }}
                >
                  <Tooltip title={"Delete"} placement="top" arrow>
                    <Delete />
                  </Tooltip>
                </div>
              </div>
            );
          },
        },
      };
    }
    if (column.label === "Highlight Color") {
      return {
        name: "color",
        options: {
          filter: true,
          sort: true,
          customHeadLabelRender: () =>
            generateCustomHeaderName("Highlight Color"),
          customBodyRender: (value: string) => {
            return (
              <>
                {value ? (
                  <div
                    style={{
                      backgroundColor: value,
                      width: "30px",
                      height: "30px",
                      border: `2px solid ${value}`,
                      borderRadius: "5px",
                      margin: "10px 10px 10px 10px",
                    }}
                  ></div>
                ) : (
                  "-"
                )}
              </>
            );
          },
        },
      };
    } else {
      return generateCustomColumn(
        column.name,
        column.label,
        column.bodyRenderer
      );
    }
  };

  const formCols = columnConfig.map((col: any) => {
    return generateConditionalColumn(col);
  });

  const handlePageChangeWithFilter = (
    newPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setFilteredObject: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setPage(newPage);
    setFilteredObject((prevState: any) => ({
      ...prevState,
      page: newPage + 1,
    }));
  };

  const handleChangeRowsPerPageWithFilter = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setFilteredObject: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const pageSize = parseInt(event.target.value);

    setRowsPerPage(pageSize);
    setPage(0);
    setFilteredObject((prevState: any) => ({
      ...prevState,
      page: 1,
      limit: pageSize,
    }));
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
  };

  const deleteData = async () => {
    const params = {
      id: deleteId,
    };
    const url = `${process.env.baseURL}/form/delete`;
    const successCallback = (
      ResponseData: null,
      error: boolean,
      ResponseStatus: string
    ) => {
      if (ResponseStatus === "success" && error === false) {
        toast.success("Record has been deleted successfully.");
        getFormList();
        setDeleteOpen(false);
      } else {
        setDeleteOpen(false);
        getFormList();
        toast.success("Please try again later.");
      }
    };
    callAPI(url, params, successCallback, "POST");
  };

  return (
    <>
      {loaded ? (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={data}
            columns={formCols}
            title={undefined}
            options={{
              filterType: "checkbox",
              responsive: "standard",
              tableBodyHeight: "75vh",
              viewColumns: false,
              filter: false,
              print: false,
              download: false,
              search: false,
              pagination: false,
              selectToolbarPlacement: "none",
              draggableColumns: {
                enabled: true,
                transitionTime: 300,
              },
              elevation: 0,
              selectableRows: "none",
              textLabels: {
                body: {
                  noMatch: (
                    <div className="flex items-start">
                      <span>Currently there is no record found.</span>
                    </div>
                  ),
                  toolTip: "",
                },
              },
            }}
            data-tableid="unassignee_Datatable"
          />
          <TablePagination
            component="div"
            count={tableDataCount}
            page={page}
            onPageChange={(
              event: React.MouseEvent<HTMLButtonElement> | null,
              newPage: number
            ) => {
              handlePageChangeWithFilter(newPage, setPage, setFilteredOject);
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleChangeRowsPerPageWithFilter(
                event,
                setRowsPerPage,
                setPage,
                setFilteredOject
              );
            }}
          />
        </ThemeProvider>
      ) : (
        <Loader />
      )}
      <DeleteDialog
        isOpen={deleteOpen}
        onClose={closeDeleteModal}
        onActionClick={() => {
          deleteData();
        }}
        Title={"Delete Data"}
        firstContent={"Are you sure you want to delete this record?"}
        secondContent={""}
      />
    </>
  );
};

export default FormDatatable;
