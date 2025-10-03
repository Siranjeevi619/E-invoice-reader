import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, XCircle, Database, Globe, HardDrive } from "lucide-react";

export default function Result() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/report/${id}`)
      .then((res) => res.json())
      .then((data) => setReport(data.reportJson))
      .catch((err) => console.error(err));
  }, [id]);

  if (!report) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Report: {report.reportId}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          <span className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            <Database size={16} /> ERP: {report.meta.erp}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <Globe size={16} /> Country: {report.meta.country}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-full">
            <HardDrive size={16} /> DB: {report.meta.db}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Scores</h2>
        {Object.entries(report.scores).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm font-medium mb-1">
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
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Matched", color: "green", list: report.coverage.matched },
            { title: "Close", color: "yellow", list: report.coverage.close },
            { title: "Missing", color: "red", list: report.coverage.missing },
          ].map((section, idx) => (
            <div
              key={idx}
              className={`p-4 border rounded-lg bg-${section.color}-50`}
            >
              <h3 className={`font-semibold text-${section.color}-700 mb-2`}>
                {section.title}
              </h3>
              <ul className="text-sm list-disc pl-5 space-y-1">
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
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Rule Findings</h2>
        <ul className="space-y-3">
          {report.ruleFindings.map((finding, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm p-3 border rounded-lg hover:bg-gray-50"
            >
              {finding.ok ? (
                <CheckCircle className="text-green-500" size={18} />
              ) : (
                <XCircle className="text-red-500" size={18} />
              )}
              <div>
                <span className="font-medium">{finding.rule}</span>{" "}
                {finding.value && (
                  <span className="text-gray-500">({finding.value})</span>
                )}
                {finding.exampleLine && (
                  <span className="block text-gray-500 text-xs mt-1">
                    Line: {finding.exampleLine}, Expected: {finding.expected}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Gaps */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Detected Gaps</h2>
        <div className="flex flex-wrap gap-2">
          {report.gaps.map((gap, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
            >
              {gap}
            </span>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white shadow rounded-xl p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-4">Meta Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
