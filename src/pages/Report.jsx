import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Report() {
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchReports = async (page, limit) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/report/all?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setReports(data.reports);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page, limit);
  }, [page, limit]);

  const filteredReports = reports.filter((report) =>
    report.reportJson.reportId.toLowerCase().includes(search.toLowerCase())
  );

  const sortedReports = [...filteredReports].sort((a, b) =>
    sortAsc
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-3">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm sm:text-base">Loading reports...</p>
      </div>
    );
  }

  if (!reports.length)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-600">No reports found.</p>
      </div>
    );

  return (
    <div className="p-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <h1 className="text-xl font-bold text-gray-800">All Reports</h1>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search report ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 text-sm rounded"
          />

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="border px-2 py-1 text-sm rounded"
          >
            Sort by Date
          </button>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border px-2 py-1 text-sm rounded"
          >
            {[5, 10, 20].map((l) => (
              <option key={l} value={l}>
                {l} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
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
                  className="border px-3 py-2 text-left font-medium whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedReports.map((report) => (
              <tr
                key={report._id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/result/${report.uploadId}`)}
              >
                <td className="border px-3 py-2 text-blue-600 whitespace-nowrap">
                  {report.reportJson.reportId}
                </td>
                <td className="border px-3 py-2 whitespace-nowrap">
                  {report.reportJson.meta.country}
                </td>
                <td className="border px-3 py-2 whitespace-nowrap">
                  {report.reportJson.meta.erp}
                </td>
                <td className="border px-3 py-2 whitespace-nowrap">
                  {report.reportJson.meta.rowsParsed}
                </td>
                <td className="border px-3 py-2 whitespace-nowrap">
                  {report.reportJson.scores.overall}%
                </td>
                <td className="border px-3 py-2 whitespace-nowrap">
                  {new Date(report.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border px-3 py-1 text-sm rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 text-sm rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
