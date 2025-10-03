import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

export default function Report() {
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // items per page
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  const fetchReports = async (page, limit) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/report/all?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setReports(data.reports);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports(page, limit);
  }, [page, limit]);

  // Client-side search filter
  const filteredReports = reports.filter((report) =>
    report.reportJson.reportId.toLowerCase().includes(search.toLowerCase())
  );

  // Client-side sort by createdAt
  const sortedReports = [...filteredReports].sort((a, b) =>
    sortAsc
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (!reports.length)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-500 text-lg font-medium">No reports found.</p>
      </div>
    );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📊 All Reports</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border rounded-xl px-3 py-2 bg-white shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search report ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 outline-none text-sm text-gray-700"
            />
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
          >
            <ArrowUpDown size={16} /> Sort by Date
          </button>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-3 py-2 border rounded-xl text-sm bg-white hover:border-gray-400 transition"
          >
            {[5, 10, 20].map((l) => (
              <option key={l} value={l}>
                {l} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-lg bg-white">
        <table className="min-w-full">
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
            {sortedReports.map((report, idx) => (
              <tr
                key={report._id}
                className={`cursor-pointer transition-all duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 hover:scale-[1.01]`}
                onClick={() => navigate(`/result/${report.uploadId}`)}
              >
                <td className="px-6 py-3 text-sm font-medium text-blue-600 hover:underline">
                  {report.reportJson.reportId}
                </td>
                <td className="px-6 py-3 text-sm">
                  <span className="px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-medium">
                    {report.reportJson.meta.country}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <span className="px-2 py-1 rounded-lg bg-gray-200 text-gray-800 text-xs font-medium">
                    {report.reportJson.meta.erp}
                  </span>
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

      <div className="flex justify-end items-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
