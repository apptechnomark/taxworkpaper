/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPlusIcon from "tsconfig.json/assets/icons/AddPlusIcon`";
import DrawerOverlay from "tsconfig.json/components/common/DrawerOverlay`";
import MainWrapper from "tsconfig.json/components/common/MainWrapper`";
import FormDatatable from "tsconfig.json/components/Form/FormDatatable`";
import FormDrawer from "tsconfig.json/components/Form/FormDrawer`";
import { hasNoToken } from "tsconfig.json/utils/commonFunction`";

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

const setting = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editId, setEditId] = useState(0);
  const [data, setData] = useState<any>([]);

  const getData = async () => {
    setLoaded(false);
    try {
      let response = await axios.get(
        `https://pythonapi.pacificabs.com:5000/bookmarks`
      );
      if (response.status === 200) {
        setData(response.data);
        setLoaded(true);
      } else {
        setData([]);
        setLoaded(true);
      }
    } catch (error: any) {
      setLoaded(true);
      setData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //   useEffect(() => {
  //     hasNoToken(router);
  //   }, [router]);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setEditId(0);
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
        loaded={loaded}
        data={data}
        getData={getData}
        setOpenDrawer={setOpenDrawer}
        setEditId={setEditId}
      />

      <FormDrawer
        onOpen={openDrawer}
        onClose={handleDrawerClose}
        editId={editId}
        getData={getData}
      />

      <DrawerOverlay isOpen={openDrawer} />
      
      <ToastContainer {...toastOptions} />
    </MainWrapper>
  );
};

export default setting;
