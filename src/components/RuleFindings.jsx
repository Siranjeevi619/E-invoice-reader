import React from "react";

const RuleFindings = ({ rules }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Rule Findings</h3>
      <div className="space-y-3">
        {rules.map((rule, i) => (
          <div
            key={i}
            className={`p-3 rounded border ${
              rule.ok
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <p className="font-semibold">
              {rule.rule}:{" "}
              <span className={rule.ok ? "text-green-600" : "text-red-600"}>
                {rule.ok ? "Pass" : "Fail"}
              </span>
            </p>
            {!rule.ok && (
              <div className="text-sm mt-1 text-gray-700">
                {rule.exampleLine && <p>Line: {rule.exampleLine}</p>}
                {rule.expected && (
                  <p>
                    Expected: {rule.expected}, Got: {rule.got}
                  </p>
                )}
                {rule.value && <p>Invalid Value: {rule.value}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuleFindings;
