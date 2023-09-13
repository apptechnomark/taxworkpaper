import axios from "axios";
import { log } from "console";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "tsconfig.json/components/Spinner`";

const Automation = () => {
  const [image, setImage] = useState("");
  const [images, setImages] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [uploadBtn, setUploadBtn] = useState(false);
  const [createObjectURL, setCreateObjectURL] = useState("");

  const handleChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];
      setImage(i);

      const filename = e.target.files[0].name;
      setImages(filename);
      setCreateObjectURL(URL.createObjectURL(i));
      setDisabled(false);
    }
  };

  const handelDownload = async () => {
    const fileName = images;
    const name = fileName.substring(0, fileName.indexOf("."));
    setDownloadUrl(`http://20.235.124.147:5000/download_pdf?file_name=${name}`);
  };

  const handelUpload = async (e: any) => {
    e.preventDefault();
    setDownloadBtn(false);
    setDisabled(true);
    const body = new FormData();
    body.append("file", image);
    try {
      let response = await axios.post(
        `http://20.235.124.147:5000/process_pdf`,
        body
      );
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        setDownloadBtn(true);
      }
    } catch (error: any) {
      console.log(error);
    }
    setDisabled(false);
    setUploadBtn(false);
    handelDownload();
  };

  return (
    <>
      <section className="automationSection px-5 py-9">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="text-center">
                <th scope="col" className="px-6 py-3 text-start">
                  Upload File
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Download
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
                    className="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    size={2048}
                    onChange={handleChange}
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    Upload your ZIP file here.
                  </p>
                </th>
                <td className="px-6 py-4">
                  <button
                    className={`flex gap-[15px] bg-[#1492c8] text-white text-sm font-semibold px-4 py-2 mx-auto ${
                      disabled || uploadBtn
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    onClick={disabled || uploadBtn ? undefined : handelUpload}
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
                </td>
                <td className="px-6 py-4">
                  <a
                    href={downloadUrl}
                    className={`bg-emerald-600 px-4 py-2 text-sm font-semibold text-white
                    ${downloadBtn ? "" : "cursor-not-allowed opacity-50"}`}
                  >
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
