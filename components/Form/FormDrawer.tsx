import { Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface LabelValue {
  label: string;
  value: string;
}

const FormDrawer = ({ onOpen, onClose, editId, getData }: any) => {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("");
  const [formDropdownData, setFormDropdownData] = useState([
    { label: "W-2", value: "W-2" },
    { label: "1099-INT", value: "1099-INT" },
    { label: "1099-OID", value: "1099-OID" },
    { label: "1099-DIV", value: "1099-DIV" },
    { label: "1099-R", value: "1099-R" },
    { label: "SSA-1099", value: "SSA-1099" },
    { label: "1099-B", value: "1099-B" },
    { label: "1099-S", value: "1099-S" },
    { label: "1099-G", value: "1099-G" },
    { label: "1099-NEC", value: "1099-NEC" },
    { label: "1099-K", value: "1099-K" },
    { label: "1099-MISC", value: "1099-MISC" },
    { label: "Schedule K-1-1065", value: "Schedule K-1-1065" },
    { label: "Schedule K-1-1120S", value: "Schedule K-1-1120S" },
    { label: "Schedule K-1-1041", value: "Schedule K-1-1041" },
    { label: "1099-PATR", value: "1099-PATR" },
    { label: "1099-G", value: "1099-G" },
    { label: "1099-MISC", value: "1099-MISC" },
    { label: "W2-G", value: "W2-G" },
    { label: "1099-C", value: "1099-C" },
    { label: "1099-SA", value: "1099-SA" },
    { label: "1099-QA", value: "1099-QA" },
    { label: "1099-Q", value: "1099-Q" },
    { label: "1099-LTC", value: "1099-LTC" },
    { label: "5498", value: "5498" },
    { label: "5498-SA", value: "5498-SA" },
    { label: "1098-E", value: "1098-E" },
    { label: "1098", value: "1098" },
    { label: "W2-G", value: "W2-G" },
    { label: "1098-T", value: "1098-T" },
    { label: "1095-A/B/C", value: "1095-A/B/C" },
    { label: "1040-ES", value: "1040-ES" },
    { label: "1099-HC", value: "1099-HC" },
    { label: "CRP", value: "CRP" },
  ]);
  const [fieldName, setFieldName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [comment, setComment] = useState("");

  const getById = async () => {
    try {
      let response = await axios.get(
        `https://pythonapi.pacificabs.com:5000/bookmark/${editId}`
      );
      if (response.status === 200) {
        setFormType(response.data.bookmark);
        setFieldName(response.data.strings);
        setSelectedColor(response.data.colour);
        setComment(response.data.comments);
      } else {
        setFormType("");
        setFieldName("");
        setSelectedColor("");
        setComment("");
        toast.error("Please try again later.");
      }
    } catch (error: any) {
      toast.error("Please try again later.");
    }
  };

  useEffect(() => {
    if (editId > 0) {
      getById();
    } else {
      setFormType("");
      setFieldName("");
      setSelectedColor("");
      setComment("");
    }
  }, [editId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      formType.trim().length > 0 ||
      fieldName.trim().length > 0 ||
      selectedColor.trim().length > 0 ||
      comment.trim().length > 0
    ) {
      setLoading(true);
      const formData: any = {
        bookmark: formType,
        strings: fieldName,
        colour: selectedColor,
        comments: comment,
      };
      const url =
        editId > 0
          ? `https://pythonapi.pacificabs.com:5000/update/${editId}`
          : `https://pythonapi.pacificabs.com:5000/bookmark`;
      try {
        let response = await axios.post(url, formData);
        if (response.status === 200) {
          setLoading(false);
          getData();
          toast.success(
            editId > 0
              ? "Rule updated successfully."
              : "Rule added successfully."
          );
        } else {
          setLoading(false);
          getData();
          toast.error("Please try again later.");
        }
      } catch (error: any) {
        setLoading(false);
        toast.error("Please try again later.");
      }

      handleCloseDrawer();
    } else {
      handleCloseDrawer();
    }
  };

  const handleCloseDrawer = () => {
    setFormType("");
    setFieldName("");
    setSelectedColor("");
    setComment("");

    onClose();
  };
  return (
    <>
      <div
        className={`fixed top-0 right-0 z-30 h-screen overflow-y-auto w-[600px] border border-lightSilver bg-pureWhite transform  ${
          onOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out bg-white`}
      >
        <div className="sticky top-0 !h-[9%] bg-whiteSmoke border-b z-30 border-lightSilver">
          <div className="flex p-[6px] h-full justify-between items-center">
            <span className="flex items-center justify-center font-bold ml-[10px]">
              {editId > 0 ? "Edit Rule" : "Add Rule"}
            </span>
            <Tooltip title="Close" placement="left" arrow>
              <IconButton className="mr-[10px]" onClick={handleCloseDrawer}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={`!h-[91%]`}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between h-full pt-3 px-3"
          >
            <div>
              <FormControl variant="standard" sx={{ width: "98%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Select Form Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={formType}
                  onChange={(e) => {
                    setFormType(e.target.value);
                  }}
                >
                  {formDropdownData.map((i: LabelValue, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={
                  <span>
                    Field Name
                    {/* <span className="!text-defaultRed">&nbsp;*</span> */}
                  </span>
                }
                fullWidth
                value={fieldName?.trim().length <= 0 ? "" : fieldName}
                onChange={(e) => {
                  setFieldName(e.target.value);
                }}
                margin="normal"
                variant="standard"
                sx={{ width: "98%" }}
              />
              <div style={{ marginTop: "16px", width: "98%" }}>
                <FormLabel component="legend">Highlight Color</FormLabel>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "8px",
                    marginLeft: "10px",
                  }}
                >
                  {["#FF0000", "#00FF00", "#0000FF", "#FFFF00"].map((color) => (
                    <div
                      key={color}
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: color,
                        border: `2px solid ${
                          selectedColor === color ? "#000000" : color
                        }`,
                        cursor: "pointer",
                        borderRadius: "4px",
                        marginRight: "10px",
                      }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              <TextField
                label={
                  <span>
                    Comment
                    {/* <span className="!text-defaultRed">&nbsp;*</span> */}
                  </span>
                }
                fullWidth
                value={comment?.trim().length <= 0 ? "" : comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                margin="normal"
                variant="standard"
                sx={{ width: "98%" }}
              />
            </div>
            <div className="sticky bottom-0 !h-[9%] bg-whiteSmoke border-t z-30 border-lightSilver flex py-2 justify-end items-center">
              <div className="flex items-end justify-center">
                <Button
                  variant="outlined"
                  className="rounded-[4px] !h-[36px] !text-defaultRed border-defaultRed hover:border-defaultRed"
                  onClick={handleCloseDrawer}
                >
                  <span className="flex items-center justify-center gap-[10px] px-[5px]">
                    Close
                  </span>
                </Button>
                {loading ? (
                  <div className="!h-[36px] flex items-center justify-center !ml-6 w-[115px] bg-blue-200">
                    <CircularProgress />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    className="rounded-[4px] !h-[36px] !ml-6 !bg-[#1565C0]"
                  >
                    <span className="flex items-center justify-center gap-[10px] px-[5px]">
                      {editId > 0 ? "Save Rule" : "Add Rule"}
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormDrawer;
