"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { generatePaymentPDF } from "./generate-payment-receipt";

interface Payment {
  _id: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("Newest");
  const dataPerPage = 3;
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve userId from local storage when the component mounts
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID not found in local storage.");
    }
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!userId) return; // Exit if userId is not set

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8800/api/payment/payments/${userId}`
        );
        const fetchedPayments = response.data;

        // Sort payments based on the sort order
        const sortedPayments =
          sortOrder === "Newest"
            ? fetchedPayments.sort(
                (a: { createdAt: string }, b: { createdAt: string }) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
            : fetchedPayments.sort(
                (a: { createdAt: string }, b: { createdAt: string }) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );

        setPayments(sortedPayments);
        setTotalPages(Math.ceil(sortedPayments.length / dataPerPage));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response ? err.response.data.message : "An error occurred"
          );
        } else {
          setError("An error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [userId, sortOrder]);

  const currentData = payments.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchPayments = async (paymentid) => {
    console.log("fetching payment data")
    const response = await axios.get(`http://localhost:8800/api/payment/${paymentid}`,
    //   {
    //   params:{
    //     paymentId:paymentid
    //   }
    // }  
  );
    if (response.status === 200) {
      console.log("fetching payment data success")
        console.log(response.data.payment)
        generatePaymentPDF(response.data.payment);
    } else {
      throw new Error("Failed to fetch payment data");
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#F4F4F2]">
        <CardTitle className="text-xl font-bold text-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-9 bg-[#152f86b2] rounded" />
            <div>
              <h2>Payment History</h2>
              <p className="text-sm font-semibold text-[#152f86b2]">Details</p>
            </div>
          </div>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Sort by:</span>
          <Select
            defaultValue={sortOrder}
            onValueChange={(value) => setSortOrder(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date of Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((payment, index) => (
              <TableRow key={payment._id}>
                <TableCell>
                  {(currentPage - 1) * dataPerPage + index + 1}
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {payment._id}
                </TableCell>
                <TableCell>{payment.amount}</TableCell>

                <TableCell>
                  {(() => {
                    const status = payment.paymentStatus || "pending";
                    let statusClass = "";
                    let statusColor = "";
                    let displayStatus = status; // New variable for simplified status

                    if (status === "succeeded") {
                      statusClass = "bg-green-200 text-green-800";
                      statusColor = "border-green-500";
                      displayStatus = "Succeeded";
                    } else if (status === "failed") {
                      statusClass = "bg-red-100 text-red-800";
                      statusColor = "border-red-500";
                      displayStatus = "Failed";
                    } else if (status === "pending") {
                      statusClass = "bg-yellow-100 text-yellow-800";
                      statusColor = "border-yellow-500";
                      displayStatus = "Pending"; // Simplified text
                    } else {
                      statusClass = "bg-gray-100 text-gray-800";
                    }

                    return (
                      <span
                        className={`${statusClass} ${statusColor} px-2 py-1 rounded-md text-sm font-medium border whitespace-nowrap`}
                      >
                        {displayStatus}
                      </span>
                    );
                  })()}
                </TableCell>
                {/* <TableCell>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium border border-red-200">
                    {payment.paymentStatus}
                  </span>
                </TableCell> */}
                <TableCell>
                  {new Date(payment.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div
                  onClick={()=>fetchPayments(payment._id)}
                    // href={`http://localhost:8800/api/payment/download-receipt/${payment._id}`}
                    className="flex items-center text-[#333] hover:text-black hover:cursor-pointer"
                    style={{ textDecoration: "none" }} // Remove underline
                  >
                    <Download size={17} className="mr-1" /> Download Receipt
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4">
          <p className="text-sm text-gray-600">
            Showing {currentPage * dataPerPage - dataPerPage + 1} to{" "}
            {Math.min(currentPage * dataPerPage, payments.length)} of{" "}
            {payments.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "secondary" : "outline"}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




