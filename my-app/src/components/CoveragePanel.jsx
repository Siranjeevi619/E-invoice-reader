import React from "react";

const CoveragePanel = ({ coverage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Coverage</h3>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-green-600">Matched</h4>
          <ul className="list-disc pl-5 text-sm">
            {coverage.matched.map((field, i) => (
              <li key={i}>{field}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-yellow-600">Close</h4>
          <ul className="list-disc pl-5 text-sm">
            {coverage.close.map((item, i) => (
              <li key={i}>
                {item.candidate} → {item.target} (
                {Math.round(item.confidence * 100)}%)
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-600">Missing</h4>
          <ul className="list-disc pl-5 text-sm">
            {coverage.missing.map((field, i) => (
              <li key={i}>{field}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoveragePanel;
