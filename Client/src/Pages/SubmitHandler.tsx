"use client";

import type React from "react";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  Upload,
  AlertCircle,
} from "lucide-react";

import favicon from "../assets/favicon.ico";
import { StateContext } from "../Context API/StateContext";

interface Assignment {
  Name?: boolean;
  Class?: boolean;
  Section?: boolean;
  RollNo?: boolean;
  Department?: boolean;
  Email?: boolean;
  PhoneNumber?: boolean;
  Title?: string;
  Deadline?: string;
  [key: string]: any;
}

interface BoolField {
  key: string;
  valueState: [string, Dispatch<SetStateAction<string>>];
}

const SubmitHandler = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [assignment, setAssignments] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { setStudentName } = useContext(StateContext);

  const [nameValue, setNameValue] = useState("");
  const [classValue, setClassValue] = useState("");
  const [sectionValue, setSectionValue] = useState("");
  const [rollNoValue, setRollNoValue] = useState("");
  const [departmentValue, setDepartmentValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [phoneNumberValue, setPhoneNumberValue] = useState("");
  const { setOcrOutput, setSub_id } = useContext(StateContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<any>(
          `https://grade-genie-server.vercel.app/api/v1/generate/${shareId}`
        );
        console.log(response.data.info);
        setAssignments(response.data.info);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shareId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      if (file.type === "application/pdf") {
          if (file.size <= maxSize) {
              setUploadedFile(file);
              setError(null);
          } else {
              setUploadedFile(null);
              setError("File size exceeds 2MB limit.");
              event.target.value = "";
          }
      } else {
        setUploadedFile(null);
        setError("Invalid file type. Please upload a PDF document.");
        event.target.value = "";
      }
    } else {
      setUploadedFile(null);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSubmissionStatus("submitting");
    setError(null);

    if (!uploadedFile) {
        setError("Please upload the assignment file.");
        setSubmissionStatus(null);
        setLoading(false);
        return;
    }

    const submissionData: { [key: string]: string } = {};
    const values = [
      { key: "Name", value: nameValue },
      { key: "Class", value: classValue },
      { key: "Section", value: sectionValue },
      { key: "RollNo", value: rollNoValue },
      { key: "Department", value: departmentValue },
      { key: "Email", value: emailValue },
      { key: "PhoneNumber", value: phoneNumberValue },
      { key: "hash", value: shareId ? shareId : "null" },
    ];

    values.forEach(({ key, value }) => {
        if ((assignment && assignment[key]) || key === 'hash') {
            submissionData[key] = value;
        }
    });

    const formData = new FormData();
    for (const key in submissionData) {
      formData.append(key, submissionData[key]);
    }
    if (uploadedFile) {
      formData.append("assignmentFile", uploadedFile);
    } else {
        console.error("File missing despite check, stopping submission.");
        setError("File is required.");
        setSubmissionStatus("error");
        setLoading(false);
        return;
    }

    try {
      setStudentName(nameValue);
      const response = await axios.post(
        "https://grade-genie-server.vercel.app/api/v1/data",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSubmissionStatus("success");
      setOcrOutput(response.data.ocrText);
      setSub_id(response.data.submissionId);
      console.log("Submission successful:", response.data);
      alert("Submission successful! You will be redirected to the result page in 2 seconds.");
      setTimeout(() => {
        navigate("/result");
      }, 2000);
    } catch (submissionError: any) {
      setSubmissionStatus("error");
      console.error("Submission error:", submissionError);
      const apiErrorMessage = submissionError.response?.data?.message;
      const fallbackMessage = "Failed to submit data. Please check your input and file.";
      setError(apiErrorMessage || fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-purple-700 font-medium">
            Loading assignment details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !submissionStatus && !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Error Occurred
              </h3>
              <p className="mt-2 text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
      return (
          <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
              <div className="text-center">
              <FileText className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Assignment Not Found
              </h2>
              <p className="text-gray-600">
                  The assignment details could not be loaded. Please check the link or contact the administrator.
              </p>
              </div>
          </div>
          </div>
      );
  }

  const boolFields: BoolField[] = [
    { key: "Name", valueState: [nameValue, setNameValue] },
    { key: "Class", valueState: [classValue, setClassValue] },
    { key: "Section", valueState: [sectionValue, setSectionValue] },
    { key: "RollNo", valueState: [rollNoValue, setRollNoValue] },
    { key: "Department", valueState: [departmentValue, setDepartmentValue] },
    { key: "Email", valueState: [emailValue, setEmailValue] },
    { key: "PhoneNumber", valueState: [phoneNumberValue, setPhoneNumberValue] },
  ];

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={favicon} alt="GradeGenie Logo" className="w-8 h-8 mr-2" />
            <span className="bg-gradient-to-r font-bold from-indigo-600 to-purple-600 bg-clip-text text-transparent">GradeGenie</span>
          </div>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-700">
              {assignment.Title || "Assignment Submission"}
            </h1>
            {assignment.Deadline && (
              <div className="flex items-center justify-center mt-1 text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <p className="text-sm">
                  Deadline:{" "}
                  <span className="font-medium">{assignment.Deadline}</span>
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={submissionStatus === "submitting"}
          >
            {submissionStatus === "submitting" ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

         {error && (submissionStatus === 'error' || !uploadedFile && submissionStatus !== 'submitting') && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Submission Error
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submissionStatus === "success" && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Submission Successful
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your assignment has been submitted successfully. Redirecting to results...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {boolFields.some(field => assignment[field.key]) && (
             <section className="bg-white rounded-lg shadow-sm overflow-hidden">
             <div className="border-b border-gray-200 bg-purple-50 px-6 py-4">
               <h2 className="text-lg font-medium text-purple-800">
                 Personal Information
               </h2>
             </div>
             <div className="px-6 py-5">
               <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                 {boolFields.map(({ key, valueState }) => {
                   const [value, setValue]: [
                     string,
                     Dispatch<SetStateAction<string>>
                   ] = valueState;
                   if (assignment[key]) {
                     const labelText = key.replace(/([A-Z])/g, " $1").trim();
                     return (
                       <div key={key} className="col-span-1">
                         <label
                           htmlFor={key}
                           className="block text-sm font-medium text-gray-700 mb-1"
                         >
                           {labelText}{" "}
                             <span className="text-red-500">*</span>
                         </label>
                         <input
                           type={
                             key === "Email"
                               ? "email"
                               : key === "PhoneNumber"
                               ? "tel"
                               : "text"
                           }
                           id={key}
                           name={key}
                           value={value}
                           onChange={(e) => setValue(e.target.value)}
                           className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm disabled:bg-gray-100"
                           placeholder={`Enter your ${labelText}`}
                           aria-required={true}
                           required={true}
                           disabled={submissionStatus === "submitting"}
                         />
                       </div>
                     );
                   }
                   return null;
                 })}
               </div>
             </div>
           </section>
          )}

          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-purple-50 px-6 py-4">
              <h2 className="text-lg font-medium text-purple-800">
                Assignment Submission
              </h2>
            </div>
            <div className="px-6 py-5">
              <label
                htmlFor="assignmentFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Assignment File (PDF, max 2MB){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${error && error.includes("File") ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md hover:bg-gray-50 transition-colors`}>
                <div className="space-y-1 text-center">
                  {!uploadedFile ? (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="assignmentFile"
                          className={`relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none ${submissionStatus === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span>Upload a file</span>
                          <input
                            id="assignmentFile"
                            name="assignmentFile"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="sr-only"
                            required
                            disabled={submissionStatus === "submitting"}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF documents only, max 2MB.
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="h-10 w-10 text-purple-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900 break-all px-2">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                            setUploadedFile(null);
                            if (error && (error.includes("File size") || error.includes("Invalid file type"))) {
                                setError(null);
                            }
                            const fileInput = document.getElementById('assignmentFile') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                        }}
                        className={`mt-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${submissionStatus === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={submissionStatus === "submitting"}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {error && (error.includes("File size") || error.includes("Invalid file type")) && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
               {error && error === "Please upload the assignment file." && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          </section>
        </div>

         <div className="mt-8">
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submissionStatus === "submitting" || loading }
            >
              {submissionStatus === "submitting" || (loading && !assignment) ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {loading && !assignment ? 'Loading...' : 'Submitting...'}
                </span>
              ) : (
                "Submit Assignment"
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            Please ensure all required fields (*) are filled and the correct file is uploaded before submitting.
          </p>
        </div>
      </footer>
    </form>
  );
};

export default SubmitHandler;