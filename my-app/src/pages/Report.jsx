import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Report() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/report/all")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, []);

  if (!reports.length)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-500 text-lg font-medium">No reports found.</p>
      </div>
    );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 All Reports</h1>

      <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Report ID",
                "Country",
                "ERP",
                "Rows Parsed",
                "Overall Score",
                "Created At",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reports.map((report, idx) => (
              <tr
                key={report._id}
                className={`cursor-pointer transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
                onClick={() => navigate(`/result/${report.uploadId}`)}
              >
                <td className="px-6 py-3 text-sm font-medium text-blue-600 hover:underline">
                  {report.reportJson.reportId}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {report.reportJson.meta.country}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {report.reportJson.meta.erp}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {report.reportJson.meta.rowsParsed}
                </td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      report.reportJson.scores.overall >= 80
                        ? "bg-green-100 text-green-700"
                        : report.reportJson.scores.overall >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {report.reportJson.scores.overall}%
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {new Date(report.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
