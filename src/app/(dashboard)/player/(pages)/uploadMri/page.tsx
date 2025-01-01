// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ChevronLeft } from "lucide-react";
// import { FileUpload } from "@/components/ui/file-upload";
// import axios from "axios";
// import "./style.css"; // Assuming you have some custom styles defined

// const UploadMriFile = () => {
//   const [files, setFiles] = useState([]);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [assessmentResults, setAssessmentResults] = useState(null);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleFileUpload = (uploadedFiles) => {
//     setFiles(uploadedFiles);
//   };

//   const handleButtonClick = async (e) => {
//     e.preventDefault();
//     if (files.length > 0) {
//       const authToken = localStorage.getItem("authToken");
//       setUploadStatus("loading");
//       try {
//         const formData = new FormData();
//         formData.append("mriFile", files[0]);

//         const response = await axios.post(
//           "http://localhost:8800/api/mriFile/upload",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${authToken}`,
//             },
//             timeout: 60000000, // 60 seconds timeout
//           }
//         );
//         setUploadStatus("succeeded");
//         setAssessmentResults(response.data); // Save the full response

//         // Reset error state if it was previously set
//         setError(null);
//       } catch (err) {
//         setUploadStatus("failed");
//         setError(err.response?.data || err.message);
//       }
//     }
//   };

//   const getBackgroundColor = (assessmentResult) => {
//     switch (assessmentResult) {
//       case "Healthy":
//         return "text-green-500"; // Green for healthy
//       case "Partial ACL Tear OR Partially Injured":
//         return "text-yellow-500"; // Yellow for partial tear
//       case "Complete ACL Tear OR Completely Ruptured":
//       case "ACL Tear":
//         return "text-red-500"; // Red for complete tear or general ACL tear
//       default:
//         return "text-gray-500"; // Default background
//     }
//   };

//   const goBack = () => {
//     router.back();
//   };

//   const isButtonDisabled = uploadStatus === "loading" || files.length === 0;

//   return (
//     <>
//       <div
//         className="flex items-center cursor-pointer mb-2 ml-5"
//         onClick={goBack}
//       >
//         <ChevronLeft className="h-6 w-6 text-gray-600" />
//         <p className="ml- text-gray-600 font-bold">Back</p>
//       </div>
//       <div className="w-full max-w-4xl mx-auto min-h-80 border border-dashed bg-onHover border-gray-600 rounded-lg">
//         <FileUpload onChange={handleFileUpload} />
//       </div>

//       {uploadStatus === "loading" && (
//         <div className="flex flex-col justify-center items-center my-4">
//           <div className="loader"></div>
//           <p className="ml-4 text-lg text-gray-400 mt-2 font-bold">
//             Preprocessing...
//           </p>
//         </div>
//       )}

//       {uploadStatus === "succeeded" && assessmentResults && (
//         <div className="flex flex-col items-center p-4 my-4 rounded bg-darkslateblue text-center">
//           <h3 className="text-lg font-bold text-white">
//             MRI Assessment Report:
//           </h3>
//           <p className="text-lg mt-2 text-gray-600">
//             <strong className="text-[#333]">Report:</strong>{" "}
//             {assessmentResults.assessmentResult.reportPath.split("/").pop()}
//           </p>
//           <p className="text-lg mt-2 text-gray-600">
//             <strong className="text-[#333]">Date:</strong>{" "}
//             {new Date().toLocaleDateString()}
//           </p>
//           <p
//             className={`text-lg mt-2 font-bold ${getBackgroundColor(
//               assessmentResults.assessmentResult.assessmentResult
//             )}`}
//           >
//             <strong className="text-lg font-bold text-white">Result:</strong>{" "}
//             {assessmentResults.assessmentResult.assessmentResult}
//           </p>

//           {/* Display the uploaded Cloudinary image */}
//           {assessmentResults.image_url && (
//             <div className="mt-6">
//               <img
//                 src={assessmentResults.image_url}
//                 alt="Processed MRI"
//                 className="rounded-lg border border-gray-400"
//                 style={{ maxWidth: "100%", maxHeight: "400px" }}
//               />
//             </div>
//           )}

//           <a
//             href={`http://localhost:8800/api/mriFile${assessmentResults.assessmentResult.reportPath}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="mt-4 bg-buttonColor text-white px-6 py-3 rounded-md text-lg font-bold no-underline"
//           >
//             PreView Report (PDF)
//           </a>

//           <p className="text-xs mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
//             Disclaimer: These results may not be 100% accurate. Please consult a
//             doctor or radiologist for a professional opinion.
//           </p>
//         </div>
//       )}

//       {uploadStatus === "failed" && error && (
//         <div
//           className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
//           role="alert"
//         >
//           <strong className="font-bold">Error:</strong>
//           <span className="block sm:inline">
//             {JSON.stringify(error, null, 2)}
//           </span>
//         </div>
//       )}

//       <div className="mt-6 flex justify-center">
//         <button
//           className={`px-6 py-3 text-white rounded-md font-montserrat font-bold text-[1rem] transition-all duration-200 ${
//             isButtonDisabled
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-buttonColor hover:bg-onHover"
//           }`}
//           onClick={handleButtonClick}
//           disabled={isButtonDisabled}
//         >
//           Continueeee
//         </button>
//       </div>
//     </>
//   );
// };

// export default UploadMriFile;

// ! Final code stripe and MRI
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import "./style.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
); // Load Stripe with publishable key
interface AssessmentResult {
  assessmentResult: {
    reportPath: string;
    assessmentResult: string;
  };
}


const UploadMriFile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const [assessmentResults, setAssessmentResults] =
    useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState(""); // Track payment status
  const [isPaid, setIsPaid] = useState(false); // New: Track payment status for report download
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const router = useRouter();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (files.length > 0) {
      const authToken = localStorage.getItem("authToken");
      setUploadStatus("loading");

      try {
        // Step 1: Generate the presigned URL
        const presignedUrlResponse = await axios.get(
          "http://localhost:8800/api/mriFile/generate_presigned_url",
          {
            params: {
              fileName: files[0].name, // get the file name
              fileType: files[0].type, // Use the file's MIME type/application/octet-stream
              folderName: "Files", // S3 folder name
            },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const presignedUrl = presignedUrlResponse.data.data; // extracting the URL
        console.log("Presigned URL:", presignedUrl);

        if (!presignedUrl) {
          throw new Error("Failed to retrieve presigned URL");
        }

        // Step 2: Upload the file to S3 using the presigned URL
        await axios.put(presignedUrl, files[0], {
          headers: {
            "Content-Type": files[0].type,
          },
        });

        // Construct file URL for further use
        const fileURL = `https://skillsyncprobucket.s3.amazonaws.com/Files/${files[0].name}`;

        // Step 3: Send the S3 file URL to your server for further processing
        const response = await axios.post(
          "http://localhost:8800/api/mriFile/upload",
          {
            fileUrl: fileURL, // Correct URL file
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            timeout: 60000000, // 60 seconds timeout
          }
        );

        console.log("Upload Response:", response.data);
        setUploadStatus("succeeded");
        setAssessmentResults(response.data);
        if (response.data.image_url) {
          setProcessedImageUrl(response.data.image_url); 
      } else {
          setError("No processed image received");
      }
      } catch (err) {
        setUploadStatus("failed");
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || err.message);
        } else {
          setError(String(err));
        }
        console.error("Error during upload:", err);
      }
    }
  };

  // New Function to handle Stripe payment
  const handleCheckout = async () => {
    let amount = 5000; // Default amount in cents (e.g., $50.00)
    const stripe = await stripePromise;
    const token = localStorage.getItem("authToken");
    console.log("TOken",token)
    const promoCode = await axios.get("http://localhost:8800/api/promo",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });

    console.log("promocode",promoCode);
    if (promoCode.status == 200){
      console.log("Promo code applied");
      amount = 2500;
    }


    

    // // Retrieve the userId from localStorage
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
    try {
    //   // Call the backend to create a Stripe checkout session
      const response = await axios.post(
        "http://localhost:8800/api/payment/create-checkout-session",
        { userId, amount }, // Use the retrieved userId from localStorage
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const { sessionId } = response.data;

      // Redirect to Stripe Checkout
      const { error} = await stripe.redirectToCheckout({ sessionId });
      if (error) console.error("Stripe checkout error", error);
      else{
        setPaymentStatus("succeeded");
        confirmPaymentStatus(sessionId);
      }
    } catch (error) {
      setPaymentStatus("failed");
      console.error("Error during checkout:", error);
    }
  };

  const confirmPaymentStatus = async(sessionId) => {
    // Simulate successful payment for demo purposes (real app: verify payment status from backend)
    const reponse = await axios.get(`http://localhost:8800/api/payment/payment-success/?session_id=${sessionId}`);
    console.log('payment resoinse',reponse);
    setIsPaid(true);
  };

  const getBackgroundColor = (assessmentResult: string) => {
    switch (assessmentResult) {
      case "Healthy":
        return "text-green-500"; // Green for healthy
      case "Partial ACL Tear OR Partially Injured":
        return "text-yellow-500"; // Yellow for partial tear
      case "Complete ACL Tear OR Completely Ruptured":
      case "ACL Tear":
        return "text-red-500"; // Red for complete tear or general ACL tear
      default:
        return "text-gray-500"; // Default background
    }
  };

  const goBack = () => {
    router.back();
  };

  const isButtonDisabled = uploadStatus === "loading" || files.length === 0;

  return (
    <>
      <div className="flex items-center cursor-pointer mb-2 " onClick={goBack}>
        <ChevronLeft className="h-6 w-6 text-gray-600" />
        <p className="ml- text-gray-600 font-bold">Back</p>
      </div>

      <div className="w-full max-w-4xl mx-auto min-h-80  border-gray-600 rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>

      {uploadStatus === "loading" && (
        <div className="flex flex-col justify-center items-center my-4">
          <div className="loader"></div>
          <p className="ml-4 text-lg text-gray-400 mt-2 font-bold">
            Preprocessing...
          </p>
        </div>
      )}
      {uploadStatus === "succeeded" && processedImageUrl && (
            <div>
                <h2>Processed Image:</h2>
                <img src={processedImageUrl} alt="Processed MRI" style={{ maxWidth: "100%" }} />
            </div>
        )}

      {uploadStatus === "succeeded" && assessmentResults && (
        <div className="flex flex-col items-center p-4 my-4 rounded bg-darkslateblue text-center">
          <h3 className="text-lg font-bold text-white">
            MRI Assessment Report:
          </h3>
          <p className="text-lg mt-2 text-gray-600">
            <strong className="text-[#333]">Report:</strong>{" "}
            {assessmentResults.assessmentResult.reportPath.split("/").pop()}
          </p>
          <p className="text-lg mt-2 text-gray-600">
            <strong className="text-[#333]">Date:</strong>{" "}
            {new Date().toLocaleDateString()}
          </p>
          <p
            className={`text-lg mt-2 font-bold ${getBackgroundColor(
              assessmentResults.assessmentResult.assessmentResult
            )}`}
          >
            <strong className="text-lg font-bold text-black">Result:</strong>{" "}
            {assessmentResults.assessmentResult.assessmentResult}
          </p>

          {/* New: Checkout button for Stripe payment */}
          {!isPaid && (
            <button
              onClick={handleCheckout}
              className="mt-4 bg-buttonColor text-white px-6 py-3 rounded-md text-lg font-bold"
            >
              Pay for MRI Report
            </button>
          )}

          {paymentStatus === "failed" && (
            <p className="text-red-500 mt-4">
              Payment failed. Please try again.
            </p>
          )}

          {/* Display report download link only after payment */}
          {isPaid && (
            <a
              href={`http://localhost:8800/api/mriFile${assessmentResults.assessmentResult.reportPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-buttonColor text-white px-6 py-3 rounded-md text-lg font-bold no-underline"
            >
              Preview & Download Report (PDF)
            </a>
          )}

          <p className="text-xs mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
            Disclaimer: These results may not be 100% accurate. Please consult a
            doctor or radiologist for a professional opinion.
          </p>
        </div>
      )}

      {uploadStatus === "failed" && error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">
            {JSON.stringify(error, null, 2)}
          </span>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          className={`px-6 py-3 text-white rounded-md font-montserrat font-bold text-[1rem] transition-all duration-200 ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-buttonColor hover:bg-buttonHover"
          }`}
          onClick={handleButtonClick}
          disabled={isButtonDisabled}
        >
          Upload
        </button>
      </div>
    </>
  );
};

export default UploadMriFile;
