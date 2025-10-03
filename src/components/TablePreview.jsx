import React from "react";

const TablePreview = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-gray-500">
        No data available
      </div>
    );
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Table Preview</h3>
      <table className="min-w-[600px] sm:min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="border px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 20).map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col, i) => (
                <td
                  key={i}
                  className="border px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                >
                  {row[col] !== undefined ? row[col].toString() : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePreview;
