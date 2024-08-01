import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastOptions } from "react-toastify";
import Draganddrop from "tsconfig.json/components/Draganddrop`";
import DraganddropNew from "./DraganddropNew";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

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

interface ReorderSectionProps {
  data: ResponseData | null;
  setFileUploaded: any;
}

interface BookmarkDetail {
  bookmark: string;
  pdf: string[];
}

interface ResponseData {
  bookmark_detail: BookmarkDetail[];
  preview_pdf: string;
  meta_folder: string;
  file_name: string;
  message: string;
}

const ReorderSection: React.FC<ReorderSectionProps> = ({
  data,
  setFileUploaded,
}) => {
  const [changesMade, setChangesMade] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [previewButtonDisabled, setPreviewButtonDisabled] = useState(true);
  const [fileData, setFileData] = useState<BookmarkDetail[]>([]);
  const [previewFile, setPreviewFile] = useState("");
  const [downloadFile, setDownloadFile] = useState("");
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  useEffect(() => {
    if (data !== null && data.bookmark_detail.length > 0) {
      setFileData(data.bookmark_detail);
      setPreviewFile(data.preview_pdf);
      setDownloadFile(data.meta_folder);
      setSaveButtonDisabled(false);
    } else {
      setFileData([]);
    }
  }, [data]);

  useEffect(() => {
    if (changesMade) {
      setSaveButtonDisabled(false);
      setPreviewButtonDisabled(true);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [changesMade]);

  const handleSave = async () => {
    try {
      let response = await axios.post(
        `https://pythonapi.pacificabs.com:5000/re_arrange_pdf`,
        {
          bookmark_detail: fileData,
          meta_folder: data?.meta_folder,
          preview_pdf: data?.preview_pdf,
          file_name: data?.file_name,
          message: data?.message,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message, toastOptions);
        setChangesMade(false);
        setSaveButtonDisabled(true);
        setPreviewButtonDisabled(false);
        setPreviewFile(response.data.preview_pdf);
        setDownloadFile(response.data.meta_folder);
      } else {
        toast.error(response.data.message, toastOptions);
        setPreviewFile("");
        setDownloadFile("");
      }
    } catch (error: any) {
      toast.error(error.message, toastOptions);
      // setChangesMade(false);
      // setSaveButtonDisabled(true);
      // setPreviewButtonDisabled(false);
    }
  };

  const handlePreviewClick = () => {
    const link = document.createElement("a");
    link.href = previewFile;
    link.download = !!data ? data.file_name : "marge_pdf.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setPreviewButtonDisabled(true);
  };

  const handleDownloadClick = async () => {
    try {
      const response = await axios.get(
        `https://pythonapi.pacificabs.com:5000/download_pdf`,
        {
          params: {
            meta_fol: downloadFile,
            ufilename: !!data && data.file_name,
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Failure") {
          toast.error("Please try again later.");
        } else {
          const blob = new Blob([response.data], {
            type: "application/zip",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = data ? `${data.file_name.split(".pdf")[0]}.zip` : "marge_pdf.zip";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success("Data exported successfully.");
        }
      } else {
        toast.error("Please try again later.");
      }
    } catch (error) {
      toast.error("Error exporting data.");
    }
  };

  return (
    <section className="automationSection px-5 py-9">
      <div className="container mx-auto px-20">
        <p
          className="mb-4 cursor-pointer"
          onClick={() => {
            setFileUploaded(false);
          }}
        >
          &lt;&nbsp;Go Back
        </p>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="text-center">
                <th
                  scope="col"
                  className="px-6 py-3 text-start flex items-center justify-between"
                >
                  Reorder
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className={`flex gap-[15px] bg-[#1492C8] text-white text-sm font-semibold px-4 py-2 rounded-md ${
                        saveButtonDisabled
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      onClick={saveButtonDisabled ? undefined : handleSave}
                    >
                      Save
                    </button>
                    <button
                      className={`flex gap-[15px] bg-[#259916] text-white text-sm font-semibold px-4 py-2 rounded-md ${
                        previewButtonDisabled
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      // onClick={
                      //   previewButtonDisabled ? undefined : handlePreviewClick
                      // }
                    >
                      <a href={previewFile} target="_blank">
                        Preview
                      </a>
                    </button>
                    <button
                      className="flex gap-[15px] bg-[#259916] text-white text-sm font-semibold px-4 py-2 rounded-md"
                      onClick={() => setDownloadDialogOpen(true)}
                    >
                      Download
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center">
                <DraganddropNew
                  fileData={fileData}
                  setFileData={setFileData}
                  onDataChange={() => setChangesMade(true)}
                />

                <Dialog
                  open={downloadDialogOpen}
                  onClose={() => setDownloadDialogOpen(false)}
                >
                  <DialogTitle className="border-b">Download File</DialogTitle>
                  <DialogContent>
                    <p className="pt-2 pb-10 pr-20">
                      Please preview before download?
                    </p>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setDownloadDialogOpen(false)}
                      color="error"
                      variant="outlined"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handlePreviewClick}
                      color="primary"
                      variant="contained"
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={handleDownloadClick}
                      color="success"
                      variant="contained"
                    >
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ReorderSection;
