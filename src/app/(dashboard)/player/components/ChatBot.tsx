// "use client";
// import "tailwindcss/tailwind.css";

// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Send,
//   X,
//   UserCircle2,
//   BrainCircuit,
//   Paperclip,
// } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { BsRobot } from "react-icons/bs";

// export default function ChatBot() {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [messages, setMessages] = React.useState([
//     { sender: "bot", content: "Hi, how can I help you today?" },
//   ]);
//   const [input, setInput] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const messagesEndRef = React.useRef<HTMLDivElement>(null);
//   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   React.useEffect(() => {
//     scrollToBottom();
//   }, [messages]);




//   const handleSend = async () => {
//     if (input.trim()) {
//       setMessages([...messages, { sender: "user", content: input }]);
//       setInput("");
//       setIsLoading(true);
  
//       try {
//         // Make a request to the FastAPI server for querying the /chat/ endpoint
//         // const response = await fetch(`http://127.0.0.1:8000/chat/?question=${encodeURIComponent(input)}`, {
//         //   method: "POST",  // Change to GET since we're passing the question as a query parameter
//         //   headers: {
//         //     "Content-Type": "application/json",
//         //   },
//         // });
//         const formData = new FormData();
//         formData.append('question', input); 

//         console.log("in bottt")

//         const response = await fetch('http://127.0.0.1:8000/chat/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ question: input })
//         });
  
//         console.log(response)
  
//         if (response.ok) {
//           const data = await response.json();
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { sender: "bot", content: data.response }, // Update to use 'response' from FastAPI
//           ]);
//         } else {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { sender: "bot", content: "Sorry, something went wrong." },
//           ]);
//         }
//       } catch (error) {
//         console.error("Error querying the FastAPI server:", error);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { sender: "bot", content: "Error querying the server." },
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };
  



//   // Function to handle sending a message to the chatbot
//   // const handleSend = async () => {
//   //   if (input.trim()) {
//   //     setMessages([...messages, { sender: "user", content: input }]);
//   //     setInput("");
//   //     setIsLoading(true);

//   //     try {
//   //       // Make a request to the FastAPI server for querying the /chat/ endpoint
//   //       const response = await fetch("http://127.0.0.1:8000/chat/", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           question: input,
//   //         }),
//   //       });

//   //       if (response.ok) {
//   //         const data = await response.json();
//   //         setMessages((prevMessages) => [
//   //           ...prevMessages,
//   //           { sender: "bot", content: data.response }, // Update to use 'response' from FastAPI
//   //         ]);
//   //       } else {
//   //         setMessages((prevMessages) => [
//   //           ...prevMessages,
//   //           { sender: "bot", content: "Sorry, something went wrong." },
//   //         ]);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error querying the FastAPI server:", error);
//   //       setMessages((prevMessages) => [
//   //         ...prevMessages,
//   //         { sender: "bot", content: "Error querying the server." },
//   //       ]);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   }
//   // };

//   // Function to handle PDF upload
//   const handleFileUpload = async () => {
//     if (selectedFile) {
//       setIsLoading(true);
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       try {
//         // Make a request to the FastAPI server for uploading
//         const response = await fetch("http://127.0.0.1:8000/upload/", {
//           method: "POST",
//           body: formData,
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { sender: "bot", content: data.message },
//           ]);
//         } else {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { sender: "bot", content: "Failed to upload the file." },
//           ]);
//         }
//       } catch (error) {
//         console.error("Error uploading the file to the FastAPI server:", error);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { sender: "bot", content: "Error uploading the file." },
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <TooltipProvider>
//       <div className="fixed bottom-4 right-4 z-50">
//         {!isOpen && (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 onClick={() => setIsOpen(true)}
//                 className="rounded-full w-16 h-16 shadow-lg bg-darkBlue hover:bg-onHover transition-all duration-300 ease-in-out transform hover:scale-110"
//               >
//                 <BsRobot className="w-10 h-10 text-white" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent className="text-white bg-darkBlue font-semibold text-md">
//               <p>ChatBot</p>
//             </TooltipContent>
//           </Tooltip>
//         )}
//         {isOpen && (
//           <Card className="w-[450px] max-h-[100vh] flex flex-col shadow-xl absolute bottom-0 right-0 rounded-xl overflow-hidden h-[28rem]">
//             <CardHeader className="flex flex-row items-center bg-white text-gray-800 rounded-t-lg shadow-md z-10">
//               <Avatar className="h-12 w-12 border-2 border-gray-800">
//                 <AvatarImage src="/placeholder-avatar.jpg" alt="Bot Avatar" />
//                 <AvatarFallback>AI</AvatarFallback>
//               </Avatar>
//               <div className="ml-3 flex-grow">
//                 <p className="text-xl font-bold">
//                   AI Health Assistant (Chatbot)
//                 </p>
//                 <p className="text-sm">Always here to help</p>
//               </div>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-full transition-colors duration-200"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <X className="h-6 w-6" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Close Chatbot</p>
//                 </TooltipContent>
//               </Tooltip>
//             </CardHeader>
//             <CardContent className="flex-grow overflow-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     message.sender === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`flex items-end max-w-[80%] ${
//                       message.sender === "user"
//                         ? "flex-row-reverse"
//                         : "flex-row"
//                     }`}
//                   >
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Avatar
//                           className={`h-10 w-10 ${
//                             message.sender === "user" ? "ml-2" : "mr-2"
//                           } cursor-pointer transition-transform duration-200 hover:scale-110`}
//                         >
//                           {message.sender === "user" ? (
//                             <UserCircle2 className="h-8 w-8 text-primary p-1" />
//                           ) : (
//                             <BrainCircuit className="h-8 w-8 text-primary p-1" />
//                           )}
//                         </Avatar>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>
//                           {message.sender === "user" ? "You" : "AI Assistant"}
//                         </p>
//                       </TooltipContent>
//                     </Tooltip>
//                     <div
//                       className={`p-3 rounded-lg ${
//                         message.sender === "user"
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-muted"
//                       }`}
//                     >
//                       <p className="font-medium">{message.content}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {isLoading && (
//                 <div className="flex justify-start">
//                   <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
//                     <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
//                     <div
//                       className="w-3 h-3 bg-primary rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                     <div
//                       className="w-3 h-3 bg-primary rounded-full animate-bounce"
//                       style={{ animationDelay: "0.4s" }}
//                     ></div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </CardContent>
//             <CardFooter className="border-t">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleSend();
//                 }}
//                 className="flex w-full items-center space-x-2"
//               >
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       type="button"
//                       size="icon"
//                       variant="ghost"
//                       className="text-muted-foreground hover:text-primary"
//                       onClick={handleFileUpload}
//                       disabled={!selectedFile || isLoading}
//                     >
//                       <Paperclip className="h-5 w-5" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Attach a file</p>
//                   </TooltipContent>
//                 </Tooltip>
//                 <Input
//                   type="file"
//                   onChange={(e) =>
//                     setSelectedFile(e.target.files ? e.target.files[0] : null)
//                   }
//                   className="hidden"
//                 />
//                 <Input
//                   type="text"
//                   placeholder="Type your message..."
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   className="flex-grow"
//                 />
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       type="submit"
//                       size="icon"
//                       disabled={isLoading}
//                       className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
//                     >
//                       <Send className="h-5 w-5" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Send message</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </form>
//             </CardFooter>
//           </Card>
//         )}
//       </div>
//     </TooltipProvider>
//   );
// }

// // "use client";
// // import "tailwindcss/tailwind.css";

// // import * as React from "react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardFooter,
// //   CardHeader,
// // } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import {
// //   Send,
// //   X,
// //   UserCircle2,
// //   BrainCircuit,
// //   ThumbsUp,
// //   ThumbsDown,
// //   Paperclip,
// //   HelpCircle,
// // } from "lucide-react";
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipProvider,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip";
// // import { BsRobot } from "react-icons/bs";

// // export default function ChatBot() {
// //   const [isOpen, setIsOpen] = React.useState(false);
// //   const [messages, setMessages] = React.useState([
// //     { sender: "bot", content: "Hi, how can I help you today?" },
// //   ]);
// //   const [input, setInput] = React.useState("");
// //   const [isLoading, setIsLoading] = React.useState(false);
// //   const messagesEndRef = React.useRef<HTMLDivElement>(null);
// //   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   React.useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   // Function to handle sending a message to the chatbot
// //   const handleSend = async () => {
// //     if (input.trim()) {
// //       setMessages([...messages, { sender: "user", content: input }]);
// //       setInput("");
// //       setIsLoading(true);

// //       try {
// //         // Make a request to the FastAPI server for querying
// //         const response = await fetch("http://127.0.0.1:8000/acl-query/", {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/x-www-form-urlencoded",
// //           },
// //           body: new URLSearchParams({
// //             question: input,
// //           }),
// //         });

// //         if (response.ok) {
// //           const data = await response.json();
// //           setMessages((prevMessages) => [
// //             ...prevMessages,
// //             { sender: "bot", content: data.answer },
// //           ]);
// //         } else {
// //           setMessages((prevMessages) => [
// //             ...prevMessages,
// //             { sender: "bot", content: "Sorry, something went wrong." },
// //           ]);
// //         }
// //       } catch (error) {
// //         console.error("Error querying the FastAPI server:", error);
// //         setMessages((prevMessages) => [
// //           ...prevMessages,
// //           { sender: "bot", content: "Error querying the server." },
// //         ]);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     }
// //   };

// //   // Function to handle PDF upload
// //   const handleFileUpload = async () => {
// //     if (selectedFile) {
// //       setIsLoading(true);
// //       const formData = new FormData();
// //       formData.append("file", selectedFile);

// //       try {
// //         // Make a request to the FastAPI server for uploading
// //         const response = await fetch("http://127.0.0.1:8000/upload/", {
// //           method: "POST",
// //           body: formData,
// //         });

// //         if (response.ok) {
// //           const data = await response.json();
// //           setMessages((prevMessages) => [
// //             ...prevMessages,
// //             { sender: "bot", content: data.message },
// //           ]);
// //         } else {
// //           setMessages((prevMessages) => [
// //             ...prevMessages,
// //             { sender: "bot", content: "Failed to upload the file." },
// //           ]);
// //         }
// //       } catch (error) {
// //         console.error("Error uploading the file to the FastAPI server:", error);
// //         setMessages((prevMessages) => [
// //           ...prevMessages,
// //           { sender: "bot", content: "Error uploading the file." },
// //         ]);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     }
// //   };

// //   return (
// //     <TooltipProvider>
// //       <div className="fixed bottom-4 right-4 z-50">
// //         {!isOpen && (
// //           <Tooltip>
// //             <TooltipTrigger asChild>
// //               <Button
// //                 onClick={() => setIsOpen(true)}
// //                 className="rounded-full w-16 h-16 shadow-lg bg-darkBlue hover:bg-onHover transition-all duration-300 ease-in-out transform hover:scale-110"
// //               >
// //                 <BsRobot className="w-10 h-10 text-white" />
// //               </Button>
// //             </TooltipTrigger>
// //             <TooltipContent className="text-white bg-darkBlue font-semibold text-md">
// //               <p>ChatBot</p>
// //             </TooltipContent>
// //           </Tooltip>
// //         )}
// //         {isOpen && (
// //           <Card className="w-[450px] max-h-[100vh] flex flex-col shadow-xl absolute bottom-0 right-0 rounded-xl overflow-hidden h-[28rem]">
// //             <CardHeader className="flex flex-row items-center bg-white text-gray-800 rounded-t-lg shadow-md z-10">
// //               <Avatar className="h-12 w-12 border-2 border-gray-800">
// //                 <AvatarImage src="/placeholder-avatar.jpg" alt="Bot Avatar" />
// //                 <AvatarFallback>AI</AvatarFallback>
// //               </Avatar>
// //               <div className="ml-3 flex-grow">
// //                 <p className="text-xl font-bold">
// //                   AI Health Assistant (Chatbot)
// //                 </p>
// //                 <p className="text-sm">Always here to help</p>
// //               </div>
// //               <Tooltip>
// //                 <TooltipTrigger asChild>
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-full transition-colors duration-200"
// //                     onClick={() => setIsOpen(false)}
// //                   >
// //                     <X className="h-6 w-6" />
// //                   </Button>
// //                 </TooltipTrigger>
// //                 <TooltipContent>
// //                   <p>Close Chatbot</p>
// //                 </TooltipContent>
// //               </Tooltip>
// //             </CardHeader>
// //             <CardContent className="flex-grow overflow-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100">
// //               {messages.map((message, index) => (
// //                 <div
// //                   key={index}
// //                   className={`flex ${
// //                     message.sender === "user" ? "justify-end" : "justify-start"
// //                   }`}
// //                 >
// //                   <div
// //                     className={`flex items-end max-w-[80%] ${
// //                       message.sender === "user"
// //                         ? "flex-row-reverse"
// //                         : "flex-row"
// //                     }`}
// //                   >
// //                     <Tooltip>
// //                       <TooltipTrigger asChild>
// //                         <Avatar
// //                           className={`h-10 w-10 ${
// //                             message.sender === "user" ? "ml-2" : "mr-2"
// //                           } cursor-pointer transition-transform duration-200 hover:scale-110`}
// //                         >
// //                           {message.sender === "user" ? (
// //                             <UserCircle2 className="h-8 w-8 text-primary p-1" />
// //                           ) : (
// //                             <BrainCircuit className="h-8 w-8 text-primary p-1" />
// //                           )}
// //                         </Avatar>
// //                       </TooltipTrigger>
// //                       <TooltipContent>
// //                         <p>
// //                           {message.sender === "user" ? "You" : "AI Assistant"}
// //                         </p>
// //                       </TooltipContent>
// //                     </Tooltip>
// //                     <div
// //                       className={`p-3 rounded-lg ${
// //                         message.sender === "user"
// //                           ? "bg-primary text-primary-foreground"
// //                           : "bg-muted"
// //                       }`}
// //                     >
// //                       <p className="font-medium">{message.content}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //               {isLoading && (
// //                 <div className="flex justify-start">
// //                   <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
// //                     <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
// //                     <div
// //                       className="w-3 h-3 bg-primary rounded-full animate-bounce"
// //                       style={{ animationDelay: "0.2s" }}
// //                     ></div>
// //                     <div
// //                       className="w-3 h-3 bg-primary rounded-full animate-bounce"
// //                       style={{ animationDelay: "0.4s" }}
// //                     ></div>
// //                   </div>
// //                 </div>
// //               )}
// //               <div ref={messagesEndRef} />
// //             </CardContent>
// //             <CardFooter className="border-t">
// //               <form
// //                 onSubmit={(e) => {
// //                   e.preventDefault();
// //                   handleSend();
// //                 }}
// //                 className="flex w-full items-center space-x-2"
// //               >
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       type="button"
// //                       size="icon"
// //                       variant="ghost"
// //                       className="text-muted-foreground hover:text-primary"
// //                       onClick={handleFileUpload}
// //                       disabled={!selectedFile || isLoading}
// //                     >
// //                       <Paperclip className="h-5 w-5" />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent>
// //                     <p>Attach a file</p>
// //                   </TooltipContent>
// //                 </Tooltip>
// //                 <Input
// //                   type="file"
// //                   onChange={(e) =>
// //                     setSelectedFile(e.target.files ? e.target.files[0] : null)
// //                   }
// //                   className="hidden"
// //                 />
// //                 <Input
// //                   type="text"
// //                   placeholder="Type your message..."
// //                   value={input}
// //                   onChange={(e) => setInput(e.target.value)}
// //                   className="flex-grow"
// //                 />
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       type="submit"
// //                       size="icon"
// //                       disabled={isLoading}
// //                       className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
// //                     >
// //                       <Send className="h-5 w-5" />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent>
// //                     <p>Send message</p>
// //                   </TooltipContent>
// //                 </Tooltip>
// //               </form>
// //             </CardFooter>
// //           </Card>
// //         )}
// //       </div>
// //     </TooltipProvider>
// //   );
// // }

// // Another deisgn for the chatBot
// // "use client";

// // import { useState, useEffect } from "react";
// // import {
// //   Card,
// //   CardContent,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { BsRobot } from "react-icons/bs";
// // import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
// // import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// // import Image from "next/image";
// // import logo from "@/public/assets/logo.svg";
// // type Message = {
// //   id: string;
// //   role: "ai" | "user";
// //   content: string;
// // };

// // const exampleQuestions = [
// //   "What is ACL?",
// //   "How does ACL happened?",
// //   "How to recover from ACL?.",
// // ];

// // export default function ChatbotWithIcon() {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [input, setInput] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);

// //   const handleSend = async (content: string) => {
// //     if (!content.trim()) return; // Prevent sending empty messages

// //     const userMessage: Message = {
// //       id: Date.now().toString(),
// //       role: "user",
// //       content,
// //     };
// //     setMessages((prev) => [...prev, userMessage]);
// //     setInput("");
// //     setIsLoading(true);

// //     try {
// //       // Make a request to the FastAPI server for querying
// //       const res = await fetch("http://127.0.0.1:8000/query/", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/x-www-form-urlencoded",
// //         },
// //         body: new URLSearchParams({
// //           question: content,
// //         }),
// //       });

// //       if (res.ok) {
// //         const data = await res.json();
// //         const aiResponse: Message = {
// //           id: (Date.now() + 1).toString(),
// //           role: "ai",
// //           content: data.answer,
// //         };
// //         setMessages((prev) => [...prev, aiResponse]);
// //       } else {
// //         setMessages((prev) => [
// //           ...prev,
// //           {
// //             id: (Date.now() + 1).toString(),
// //             role: "ai",
// //             content: "Sorry, something went wrong. Please try again later.",
// //           },
// //         ]);
// //       }
// //     } catch (error) {
// //       console.error("Error querying the FastAPI server:", error);
// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           id: (Date.now() + 1).toString(),
// //           role: "ai",
// //           content: "Error querying the server.",
// //         },
// //       ]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     // Scroll to bottom when new messages are added
// //     const chatContent = document.getElementById("chat-content");
// //     if (chatContent) {
// //       chatContent.scrollTop = chatContent.scrollHeight;
// //     }
// //   }, [messages]);

// //   return (
// //     // <div className="h-screen flex items-center justify-center bg-gray-100">
// //       <Dialog open={isOpen} onOpenChange={setIsOpen}>
// //         <DialogTrigger asChild>
// //           <Button
// //             className="fixed bottom-4 right-4 rounded-full w-16 h-16 bg-buttonColor hover:bg-onHover text-white shadow-lg backdrop-filter backdrop-blur-sm"
// //             onClick={() => setIsOpen(true)} // Open the modal when clicked
// //           >
// //             <BsRobot className="h-8 w-8" />
// //           </Button>
// //         </DialogTrigger>
// //         <DialogContent className="sm:max-w-[425px] p-0 w-[500px] h-[450px] rounded-3xl overflow-hidden">
// //           <Card className="w-full h-full shadow-lg rounded-3xl overflow-hidden flex flex-col ">
// //             <CardHeader className="px-6 py-3 flex justify-between items-center">
// //               <CardTitle className="text-xl font-semibold flex items-center gap-2">
// //                 {/* <MessageSquare className="h-6 w-6 text-onHover" /> */}
// //                 <Image src={logo} width={40} height={50} alt="chatBot iamge" />
// //                 AI Health Assistant (ChatBot)
// //               </CardTitle>
// //             </CardHeader>
// //             <div className="px-6 py-2 border-b">
// //               <p className="text-sm text-gray-500 mb-2 text-center">
// //                 Example questions:
// //               </p>
// //               <div className="px-6 py-3 border-b flex items-center space-x-4  whitespace-nowrap">
// //                 {exampleQuestions.map((question, index) => (
// //                   <Button
// //                     key={index}
// //                     variant="outline"
// //                     size="sm"
// //                     className="text-xs flex items-center gap-1"
// //                     onClick={() => handleSend(question)}
// //                   >
// //                     {question}
// //                   </Button>
// //                 ))}
// //               </div>
// //             </div>
// //             <CardContent
// //               id="chat-content"
// //               className="flex-grow p-6 space-y-4 overflow-y-auto"
// //             >
// //               {messages.map((message) => (
// //                 <div key={message.id} className="flex items-start gap-3">
// //                   {message.role === "ai" ? (
// //                     <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         viewBox="0 0 24 24"
// //                         fill="currentColor"
// //                         className="w-5 h-5 text-white"
// //                       >
// //                         <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
// //                       </svg>
// //                     </div>
// //                   ) : (
// //                     <Avatar>
// //                       <AvatarImage src="i.pravatar.cc" alt="User" />
// //                       <AvatarFallback>U</AvatarFallback>
// //                     </Avatar>
// //                   )}
// //                   <div
// //                     className={`flex flex-col max-w-[85%] rounded-2xl p-4 ${
// //                       message.role === "ai"
// //                         ? "bg-green-50"
// //                         : "bg-white border border-gray-200"
// //                     }`}
// //                   >
// //                     <p className="text-sm">{message.content}</p>
// //                     <div className="flex items-center justify-between mt-2">
// //                       <div className="flex items-center gap-2">
// //                         <Button variant="ghost" size="icon" className="h-6 w-6">
// //                           <ThumbsUp className="h-4 w-4" />
// //                         </Button>
// //                         <Button variant="ghost" size="icon" className="h-6 w-6">
// //                           <ThumbsDown className="h-4 w-4" />
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //               {isLoading && (
// //                 <div className="flex justify-center items-center space-x-2">
// //                   <div
// //                     className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
// //                     style={{ animationDelay: "0s" }}
// //                   ></div>
// //                   <div
// //                     className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
// //                     style={{ animationDelay: "0.2s" }}
// //                   ></div>
// //                   <div
// //                     className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
// //                     style={{ animationDelay: "0.4s" }}
// //                   ></div>
// //                 </div>
// //               )}
// //             </CardContent>
// //             <CardFooter className="p-4 flex flex-col gap-4">
// //               <div className="relative w-full">
// //                 <Input
// //                   placeholder="Ask or search anything"
// //                   value={input}
// //                   onChange={(e) => setInput(e.target.value)}
// //                   onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
// //                   className="pr-12 rounded-full"
// //                 />
// //                 <Button
// //                   size="icon"
// //                   className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full  bg-buttonColor hover:bg-onHover"
// //                   onClick={() => handleSend(input)}
// //                 >
// //                   <Send className="h-4 w-4 text-white" />
// //                 </Button>
// //               </div>
// //             </CardFooter>
// //           </Card>
// //         </DialogContent>
// //       </Dialog>
// //     // </div>
// //   );
// // }







"use client";
import "tailwindcss/tailwind.css";

import * as React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X, UserCircle2, BrainCircuit, Paperclip } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsRobot } from "react-icons/bs";

export default function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { sender: "bot", content: "Hi, how can I help you today?" },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);




  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", content: input }]);
      setInput("");
      setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: input })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.trim()) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", content: data.response },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", content: "Unable to load response. Check your connection and try again." },
          ]);
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: "Unable to load response. Check your connection and try again." },
        ]);
      }
    } catch (error) {
      console.error("Error querying the server:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", content: "Unable to load response. Check your connection and try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
    }
  };
  



  // Function to handle sending a message to the chatbot
  // const handleSend = async () => {
  //   if (input.trim()) {
  //     setMessages([...messages, { sender: "user", content: input }]);
  //     setInput("");
  //     setIsLoading(true);

  //     try {
  //       // Make a request to the FastAPI server for querying the /chat/ endpoint
  //       const response = await fetch("http://127.0.0.1:8000/chat/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           question: input,
  //         }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           { sender: "bot", content: data.response }, // Update to use 'response' from FastAPI
  //         ]);
  //       } else {
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           { sender: "bot", content: "Sorry, something went wrong." },
  //         ]);
  //       }
  //     } catch (error) {
  //       console.error("Error querying the FastAPI server:", error);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { sender: "bot", content: "Error querying the server." },
  //       ]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  // Function to handle PDF upload
  const handleFileUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        // Make a request to the FastAPI server for uploading
        const response = await fetch("http://127.0.0.1:8000/upload/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", content: data.message },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", content: "Failed to upload the file." },
          ]);
        }
      } catch (error) {
        console.error("Error uploading the file to the FastAPI server:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: "Error uploading the file." },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="rounded-full w-16 h-16 shadow-lg bg-darkBlue hover:bg-onHover transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <BsRobot className="w-10 h-10 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-white bg-darkBlue font-semibold text-md">
              <p>ChatBot</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isOpen && (
          <Card className="w-[450px] max-h-[100vh] flex flex-col shadow-xl absolute bottom-0 right-0 rounded-xl overflow-hidden h-[28rem]">
            <CardHeader className="flex flex-row items-center bg-white text-gray-800 rounded-t-lg shadow-md z-10">
              <Avatar className="h-12 w-12 border-2 border-gray-800">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Bot Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-grow">
                <p className="text-xl font-bold">
                  AI Health Assistant (Chatbot)
                </p>
                <p className="text-sm">Always here to help</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-full transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close Chatbot</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar
                          className={`h-10 w-10 ${
                            message.sender === "user" ? "ml-2" : "mr-2"
                          } cursor-pointer transition-transform duration-200 hover:scale-110`}
                        >
                          {message.sender === "user" ? (
                            <UserCircle2 className="h-8 w-8 text-primary p-1" />
                          ) : (
                            <BrainCircuit className="h-8 w-8 text-primary p-1" />
                          )}
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {message.sender === "user" ? "You" : "AI Assistant"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="font-medium">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex w-full items-center space-x-2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary"
                      onClick={handleFileUpload}
                      disabled={!selectedFile || isLoading}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach a file</p>
                  </TooltipContent>
                </Tooltip>
                <Input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="hidden"
                />
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </form>
            </CardFooter>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}

