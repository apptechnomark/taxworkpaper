import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastOptions } from "react-toastify";
import Draganddrop from "tsconfig.json/components/Draganddrop`";
import DraganddropNew from "./DraganddropNew";

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
  file_name: string;
  message: string;
}

const ReorderSection: React.FC<ReorderSectionProps> = ({
  data,
  setFileUploaded,
}) => {
  const [changesMade, setChangesMade] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [downloadButtonDisabled, setDownloadButtonDisabled] = useState(true);
  const [fileData, setFileData] = useState<BookmarkDetail[]>([]);
  const [downloadFile, setDownloadFile] = useState("");

  useEffect(() => {
    if (data !== null && data.bookmark_detail.length > 0) {
      setFileData(data.bookmark_detail);
      setSaveButtonDisabled(false);
    } else {
      setFileData([]);
    }
  }, [data]);

  useEffect(() => {
    if (changesMade) {
      setSaveButtonDisabled(false);
      setDownloadButtonDisabled(true);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [changesMade]);

  const handleSave = async () => {
    try {
      let response = await axios.post(
        `https://pythonapi.pacificabs.com:5000/re_arrange_pdf`,
        {
          bookmark_detail: fileData.map(
            (i) =>
              new Object({
                bookmark: i.bookmark,
                pdf:
                  i.pdf.length > 0
                    ? i.pdf.map((p) => p.split("5000/")[1])
                    : i.pdf,
              })
          ),
          file_name: data?.file_name,
          message: data?.message,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message, toastOptions);
        setChangesMade(false);
        setSaveButtonDisabled(true);
        setDownloadButtonDisabled(false);
        setDownloadFile(response.data.re_arrange_file_path);
      } else {
        toast.error(response.data.message, toastOptions);
        setDownloadFile("");
      }
    } catch (error: any) {
      toast.error(error.message, toastOptions);
      setChangesMade(false);
      setSaveButtonDisabled(true);
      setDownloadButtonDisabled(false);
    }
  };

  const handlePreviewClick = () => {
    const link = document.createElement("a");
    link.href = downloadFile;
    link.download = !!data?data.file_name:"marge_pdf.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadButtonDisabled(true);
  };

  const handleDownloadClick = () => {};

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
                        downloadButtonDisabled
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      onClick={
                        downloadButtonDisabled ? undefined : handlePreviewClick
                      }
                    >
                      Preview
                    </button>
                    <button
                      className="flex gap-[15px] bg-[#259916] text-white text-sm font-semibold px-4 py-2 rounded-md"
                      onClick={handleDownloadClick}
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ReorderSection;
