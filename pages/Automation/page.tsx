import axios from "axios";
import React, { useState } from "react";
import Spinner from "tsconfig.json/components/Spinner`";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
const Automation = () => {
  const [image, setImage] = useState("");
  const [images, setImages] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [uploadBtn, setUploadBtn] = useState(false);
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [fileError, setFileError] = useState(false);
  const [fileErrMsg, setFileErrorMsg] = useState("");

  const handleChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];
      setImage(i);
      const filename = e.target.files[0].name;
      setImages(filename);
      setCreateObjectURL(URL.createObjectURL(i));
      setDisabled(false);
    }
    const maxsize = 200 * 1024 * 1024;
    if (e.target.files[0]?.size > maxsize) {
      setFileError(true);
      setFileErrorMsg("Please select file less than 20 mb");
    } else if (!e.target.files[0]?.name.endsWith(".zip")) {
      setFileError(true);
      setFileErrorMsg("Only zip file is valid");
    } else {
      setFileError(false);
    }
  };

  const handelDownload = async () => {
    document.getElementById("downloadClick")?.click();
    toast.success("File automatic start downloading...!!!", toastOptions)
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    setDownloadBtn(false);
    setDisabled(true);
    const body = new FormData();
    body.append("file", image);
    try {
      let response = await axios.post(
        `https://apiuattaxworkpaper.pacificabs.com:5000/process_pdf`,
        body
      );
      if (response.status === 200) {
        toast.success(response.data.message, toastOptions);
        setDownloadBtn(true);
        const fileName = images;
        const name = fileName.substring(0, fileName?.indexOf("."));
        console.log("name", name);
        setDownloadUrl(
          `https://apiuattaxworkpaper.pacificabs.com:5000/download_pdf?file_name=${name}`
        );
        handelDownload();
      } else {
        toast.error(response.data.message, toastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
    setDisabled(false);
    setUploadBtn(false);
  };

  return (
    <>
      <section className="automationSection px-5 py-9">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="text-center">
                <th scope="col" className="px-6 py-3 text-start">
                  Upload File
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-start"
                >
                  <input
                    className="block w-90 text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    onChange={handleChange}
                  />
                  {fileError && (
                    <p
                      className="mt-1 text-sm text-red-500 dark:text-red-300"
                      id="file_input_help"
                    >
                      {fileErrMsg}
                    </p>
                  )}
                  {!fileError && (
                    <p
                      className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                      id="file_input_help"
                    >
                      Upload your ZIP file here.
                    </p>
                  )}
                </th>
                <td className="px-6 py-4">
                  <button
                    className={`flex gap-[15px] bg-[#1492c8] text-white text-sm font-semibold px-4 py-2 mx-auto ${
                      disabled || uploadBtn || fileError
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    onClick={
                      disabled || uploadBtn || fileError
                        ? undefined
                        : handleUpload
                    }
                  >
                    Upload
                    {disabled ? (
                      <>
                        <Spinner />
                      </>
                    ) : (
                      ""
                    )}
                  </button>
                  <a
                    id="downloadClick"
                    href={downloadUrl}
                    className={`hidden flex gap-[15px] bg-[#259916] text-white text-sm font-semibold px-4 py-2 mx-auto ${
                      downloadBtn ? "" : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    {/* onClick={
                      downloadBtn
                        ? () => handelDownload(images)
                        : undefined
                    } */}
                    Download
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Automation;
