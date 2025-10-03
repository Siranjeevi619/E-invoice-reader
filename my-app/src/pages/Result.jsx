import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Report: {report.reportId}</h1>
        <p className="text-sm text-gray-600">
          ERP: {report.meta.erp} | Country: {report.meta.country} | DB:{" "}
          {report.meta.db}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Scores</h2>
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
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-green-600">Matched</h3>
            <ul className="text-sm list-disc pl-5">
              {report.coverage.matched.length === 0 ? (
                <li className="text-gray-400">None</li>
              ) : (
                report.coverage.matched.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-600">Close</h3>
            <ul className="text-sm list-disc pl-5">
              {report.coverage.close.length === 0 ? (
                <li className="text-gray-400">None</li>
              ) : (
                report.coverage.close.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600">Missing</h3>
            <ul className="text-sm list-disc pl-5">
              {report.coverage.missing.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Rule Findings</h2>
        <ul className="space-y-2">
          {report.ruleFindings.map((finding, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-sm border-b pb-2"
            >
              {finding.ok ? (
                <span className="text-green-600 font-bold">✔</span>
              ) : (
                <span className="text-red-600 font-bold">✖</span>
              )}
              <span className="font-medium">{finding.rule}</span>
              {finding.value && (
                <span className="text-gray-500">({finding.value})</span>
              )}
              {finding.exampleLine && (
                <span className="text-gray-500">
                  | Line: {finding.exampleLine}, Expected: {finding.expected}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Detected Gaps</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm list-disc pl-5">
          {report.gaps.map((gap, idx) => (
            <li key={idx}>{gap}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-3">Meta Information</h2>
        <p className="text-sm">Rows Parsed: {report.meta.rowsParsed}</p>
        <p className="text-sm">Lines Total: {report.meta.linesTotal}</p>
        <p className="text-sm">Country: {report.meta.country}</p>
        <p className="text-sm">ERP: {report.meta.erp}</p>
        <p className="text-sm">Database: {report.meta.db}</p>
      </div>
    </div>
  );
}
  