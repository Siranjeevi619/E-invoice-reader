import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, XCircle, Database, Globe, HardDrive } from "lucide-react";

export default function Result() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API_URL}/api/report/${id}`)
      .then((res) => res.json())
      .then((data) => setReport(data))
      .then(console.log(report))
      .catch((err) => console.error(err));
  }, [id]);

  if (!report)
    return <p className="p-6 text-center text-gray-500 text-lg">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
          Report: {report.reportId}
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
          <span className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            <Database size={16} /> ERP: {report.meta.erp}
          </span>
          <span className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <Globe size={16} /> Country: {report.meta.country}
          </span>
          <span className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-200 text-gray-800 rounded-full">
            <HardDrive size={16} /> DB: {report.meta.db}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Scores
        </h2>
        {Object.entries(report.scores).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm sm:text-base font-medium mb-1">
              <span className="capitalize">{key}</span>
              <span>{value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  value >= 80
                    ? "bg-green-500"
                    : value >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Coverage */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Coverage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: "Matched", color: "green", list: report.coverage.matched },
            {
              title: "Close",
              color: "yellow",
              list: report.coverage.close || [],
            },
            {
              title: "Missing",
              color: "red",
              list: report.coverage.missing || [],
            },
          ].map((section, idx) => (
            <div
              key={idx}
              className={`p-3 sm:p-4 border rounded-lg bg-${section.color}-50`}
            >
              <h3 className={`font-semibold text-${section.color}-700 mb-2`}>
                {section.title}
              </h3>
              <ul className="text-sm sm:text-base list-disc pl-5 space-y-1 break-words">
                {section.list.length === 0 ? (
                  <li className="text-gray-400">None</li>
                ) : (
                  section.list.map((item, i) => <li key={i}>{item}</li>)
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Rule Findings */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Rule Findings</h2>
        <ul className="space-y-2 sm:space-y-3">
          {report.ruleFindings.map((finding, idx) => (
            <li
              key={idx}
              className="flex flex-col sm:flex-row sm:items-start gap-2 text-sm sm:text-base p-2 sm:p-3 border rounded-lg hover:bg-gray-50"
            >
              {finding.ok ? (
                <CheckCircle className="text-green-500" size={18} />
              ) : (
                <XCircle className="text-red-500" size={18} />
              )}
              <div className="flex-1">
                <span className="font-medium">{finding.rule}</span>
                {finding.value && (
                  <span className="text-gray-500"> ({finding.value})</span>
                )}
                {finding.exampleLine && (
                  <span className="block text-gray-500 text-xs sm:text-sm mt-1">
                    Line: {finding.exampleLine}, Expected: {finding.expected}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Detected Gaps */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Detected Gaps</h2>
        {report.gaps.length === 0 ? (
          <p className="text-gray-400">None</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {report.gaps.map((gap, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm sm:text-base bg-red-100 text-red-700 rounded-full"
              >
                {gap}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-xl p-4 sm:p-6 space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Meta Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
          <p>Rows Parsed: {report.meta.rowsParsed}</p>
          <p>Lines Total: {report.meta.linesTotal}</p>
          <p>Country: {report.meta.country}</p>
          <p>ERP: {report.meta.erp}</p>
          <p>Database: {report.meta.db}</p>
        </div>
      </div>
    </div>
  );
}
