import React from "react";

const TablePreview = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-500">
        No data available
      </div>
    );
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Table Preview</h3>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="border px-3 py-2 text-sm text-gray-600">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 20).map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col, i) => (
                <td key={i} className="border px-3 py-2 text-sm">
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
