import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({ onChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState(null); // Error state to handle invalid files
  const fileInputRef = useRef(null);

  const allowedExtensions = [".npy", ".pck"];

  const handleFileChange = (newFiles: File[]) => {
    const file = newFiles[0];
    const fileExtension = file.name.slice(
      ((file.name.lastIndexOf(".") - 1) >>> 0) + 2
    );

    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      setError("Invalid file type. Only .npy and .pck files are allowed.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setError(null); // Clear error when valid file is uploaded
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, idx) => idx !== index);
    setFiles(updatedFiles);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false, // Restrict to 1 file only
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
    accept: {
      "application/octet-stream": [".npy", ".pc", ".pck"],
    }, // Accept only specific formats
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-6 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden bg-gradient-to-br from-[#12182A] to-[#4E73A9]" // Gradient applied here to the whole container
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-200 dark:text-neutral-300 text-4xl">
            Upload MRI file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-300 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>
          {/* New text for file formats and image limit */}
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-500 text-sm mt-2">
            Supported formats: .npy, .pc, .pck. Maximum 1 file.
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-onHover dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md", // Changed bg to #547ea8
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-white truncate max-w-xs" // Text color changed to white
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-white shadow-input" // Text color changed to white
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                    {/* Cross icon to remove the file */}
                    <IconX
                      className="h-6 w-6 font-bold text-red-600 cursor-pointer"
                      onClick={() => removeFile(idx)} // Remove file when clicked
                    />
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-white">
                    {" "}
                    {/* Text color changed to white */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-5 py-0.5 rounded-md  dark:bg-neutral-800 "
                    >
                      {file.type}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-gray-300 dark:bg-darkslateblue flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(5,31,123,0.2)]]"
                )}
              >
                {/* Increased the size of the upload icon */}
                <IconUpload className="h-7 w-7 text-neutral-600 dark:text-neutral-300" />
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}

            {error && (
              <p className="mt-4 text-red-500 text-center font-bold">{error}</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Adjust the GridPattern to have consistent colors with no greyish effect
export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gradient-to-br from-[#12182A] to-[#4E73A9] flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0 ? "bg-transparent" : "bg-transparent"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

export default FileUpload;

// ! New version

// import { cn } from "@/lib/utils";
// import React, { useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { IconUpload, IconX } from "@tabler/icons-react";
// import { useDropzone } from "react-dropzone";

// const mainVariant = {
//   initial: {
//     x: 0,
//     y: 0,
//   },
//   animate: {
//     x: 20,
//     y: -20,
//     opacity: 0.9,
//   },
// };

// const secondaryVariant = {
//   initial: {
//     opacity: 0,
//   },
//   animate: {
//     opacity: 1,
//   },
// };

// export const FileUpload = ({ onChange }) => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [error, setError] = useState(null); // Error state to handle invalid files
//   const fileInputRef = useRef(null);

//   const allowedExtensions = [".npy", ".pck"];

//   const handleFileChange = (newFiles: File[]) => {
//     const file = newFiles[0];
//     const fileExtension = file.name.slice(
//       ((file.name.lastIndexOf(".") - 1) >>> 0) + 2
//     );

//     if (!allowedExtensions.includes(`.${fileExtension}`)) {
//       setError("Invalid file type. Only .npy and .pck files are allowed.");
//       return;
//     }

//     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//     setError(null); // Clear error when valid file is uploaded
//     onChange && onChange(newFiles);
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const removeFile = (index: number) => {
//     const updatedFiles = files.filter((_, idx) => idx !== index);
//     setFiles(updatedFiles);
//   };

//   const { getRootProps, isDragActive } = useDropzone({
//     multiple: false, // Restrict to 1 file only
//     noClick: true,
//     onDrop: handleFileChange,
//     onDropRejected: (error) => {
//       console.log(error);
//     },
//     accept: {
//       "application/octet-stream": [".npy", ".pc", ".pck"],
//     }, // Accept only specific formats
//   });

//   return (
//     <div className="w-full" {...getRootProps()}>
//       <motion.div
//         onClick={handleClick}
//         whileHover="animate"
//         className="p-6 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden border-2 border-dashed border-gray-400"
//       >
//         <input
//           ref={fileInputRef}
//           id="file-upload-handle"
//           type="file"
//           onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
//           className="hidden"
//         />
//         <div className="absolute inset-0">
//           <GridPattern />
//         </div>
//         <div className="flex flex-col items-center justify-center">
//           <p className="relative z-20 font-sans font-bold text-black text-4xl">
//             Upload MRI file
//           </p>
//           <p className="relative z-20 font-sans font-bold text-black text-base mt-2">
//             Drag or drop your files here or click to upload
//           </p>
//           {/* New text for file formats and image limit */}
//           <p className="relative z-20 font-sans font-bold text-black text-sm mt-2">
//             Supported formats: .npy, .pc, .pck. Maximum 1 file.
//           </p>
//           <div className="relative w-full mt-10 max-w-xl mx-auto">
//             {files.length > 0 &&
//               files.map((file, idx) => (
//                 <motion.div
//                   key={"file" + idx}
//                   layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
//                   className={cn(
//                     "relative overflow-hidden z-40 bg-gray-200 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md", // Changed background color to gray-200
//                     "shadow-sm"
//                   )}
//                 >
//                   <div className="flex justify-between w-full items-center gap-4">
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       layout
//                       className="text-base text-black truncate max-w-xs" // Text color changed to black
//                     >
//                       {file.name}
//                     </motion.p>
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       layout
//                       className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-black shadow-input" // Text color changed to black
//                     >
//                       {(file.size / (1024 * 1024)).toFixed(2)} MB
//                     </motion.p>
//                     {/* Cross icon to remove the file */}
//                     <IconX
//                       className="h-6 w-6 font-bold text-red-600 cursor-pointer"
//                       onClick={() => removeFile(idx)} // Remove file when clicked
//                     />
//                   </div>

//                   <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-black">
//                     {" "}
//                     {/* Text color changed to black */}
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       layout
//                       className="px-5 py-0.5 rounded-md bg-black w-7"
//                     >
//                       {file.type}
//                     </motion.p>
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       layout
//                     >
//                       modified{" "}
//                       {new Date(file.lastModified).toLocaleDateString()}
//                     </motion.p>
//                   </div>
//                 </motion.div>
//               ))}
//             {!files.length && (
//               <motion.div
//                 layoutId="file-upload"
//                 variants={mainVariant}
//                 transition={{
//                   type: "spring",
//                   stiffness: 300,
//                   damping: 20,
//                 }}
//                 className={cn(
//                   "relative group-hover/file:shadow-2xl z-40 bg-gray-300 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
//                   "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
//                 )}
//               >
//                 {/* Increased the size of the upload icon */}
//                 <IconUpload className="h-7 w-7 text-black" />
//               </motion.div>
//             )}

//             {!files.length && (
//               <motion.div
//                 variants={secondaryVariant}
//                 className="absolute opacity-0 border border-dashed border-gray-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
//               ></motion.div>
//             )}

//             {error && (
//               <p className="mt-4 text-red-500 text-center font-bold">{error}</p>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // Adjust the GridPattern to have consistent colors with no greyish effect
// export function GridPattern() {
//   const columns = 41;
//   const rows = 11;
//   return (
//     <div className="flex bg-white flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
//       {Array.from({ length: rows }).map((_, row) =>
//         Array.from({ length: columns }).map((_, col) => {
//           const index = row * columns + col;
//           return (
//             <div
//               key={`${col}-${row}`}
//               className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
//                 index % 2 === 0 ? "bg-transparent" : "bg-transparent"
//               }`}
//             />
//           );
//         })
//       )}
//     </div>
//   );
// }

// export default FileUpload;
