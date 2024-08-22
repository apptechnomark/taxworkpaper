/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddPlusIcon from "tsconfig.json/assets/icons/AddPlusIcon`";
import DrawerOverlay from "tsconfig.json/components/common/DrawerOverlay`";
import MainWrapper from "tsconfig.json/components/common/MainWrapper`";
import FormDatatable from "tsconfig.json/components/Form/FormDatatable`";
import FormDrawer from "tsconfig.json/components/Form/FormDrawer`";
import { hasNoToken } from "tsconfig.json/utils/commonFunction`";

const setting = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editId, setEditId] = useState(0);
  const [data, setData] = useState<any>([
    {
      id: "3",
      form: "W2",
      fieldName: "1254-F",
      color: "#0000FF",
      comments: "",
    },
    {
      id: "2",
      form: "1099-DIV",
      fieldName: "773-U",
      color: "#00FF00",
      comments: "form changes",
    },
    {
      id: "1",
      form: "1099-INT",
      fieldName: "1120",
      color: "#FF0000",
      comments: "set color",
    },
  ]);

  //   useEffect(() => {
  //     hasNoToken(router);
  //   }, [router]);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <MainWrapper>
      <div className="bg-white flex justify-end items-center px-[20px] py-4">
        <div className="flex gap-[20px] items-center justify-center">
          <Button
            type="submit"
            variant="contained"
            className="rounded-[4px] !h-[36px] !bg-[#1565C0]"
            onClick={handleDrawerOpen}
          >
            <span className="flex items-center justify-center gap-[10px] px-[5px]">
              <span>
                <AddPlusIcon />
              </span>
              <span>Add Rule</span>
            </span>
          </Button>
        </div>
      </div>

      <FormDatatable
        data={data}
        setData={setData}
        setOpenDrawer={setOpenDrawer}
        setEditId={setEditId}
      />

      <FormDrawer
        onOpen={openDrawer}
        onClose={handleDrawerClose}
        editId={editId}
        data={data}
        setData={setData}
      />

      <DrawerOverlay isOpen={openDrawer} />
    </MainWrapper>
  );
};

export default setting;
