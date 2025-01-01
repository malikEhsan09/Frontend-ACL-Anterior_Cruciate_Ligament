import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StatCard = ({ title, value, change, bgColor, textColor }) => (
  <Card
    className={`${bgColor} ${textColor} shadow-lg transition-all duration-300 hover:shadow-xl`}
  >
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-2">{change}</p>
    </CardContent>
  </Card>
);

export const AppointmentRow = ({ doctor, slot, date }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
    <td className="p-3">{doctor}</td>
    <td className="p-3">{slot}</td>
    <td className="p-3">{date}</td>
    <td className="p-3">
      <button className="border-green-700 bg-green-100 text-green-500 px-5 py-1 rounded-lg hover:bg-green-200 transition-colors duration-200">
        Book
      </button>
    </td>
  </tr>
);

export const Pagination = () => (
  <div className="flex items-center space-x-2">
    <button className="border border-gray-300 text-gray-600 rounded px-3 py-1 hover:bg-gray-100 transition-colors duration-200">
      &lt;
    </button>
    <button className="border border-gray-300 bg-blue-500 text-white rounded px-3 py-1">
      1
    </button>
    <button className="border border-gray-300 text-gray-600 rounded px-3 py-1 hover:bg-gray-100 transition-colors duration-200">
      2
    </button>
    <button className="border border-gray-300 text-gray-600 rounded px-3 py-1 hover:bg-gray-100 transition-colors duration-200">
      ...
    </button>
    <button className="border border-gray-300 text-gray-600 rounded px-3 py-1 hover:bg-gray-100 transition-colors duration-200">
      9
    </button>
    <button className="border border-gray-300 text-gray-600 rounded px-3 py-1 hover:bg-gray-100 transition-colors duration-200">
      10
    </button>
    <button className="border border-gray-300 text-gray-600 rounded px-3 py-1 hover:bg-gray-100 transition-colors duration-200">
      &gt;
    </button>
  </div>
);

