import React from "react";

const TablePreview = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: "8px", textAlign: "center" }}>
        No data available
      </div>
    );
  }

  const columns = Object.keys(rows[0]);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "4px 8px",
                  textAlign: "left",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col, i) => (
                <td
                  key={i}
                  style={{ border: "1px solid #ccc", padding: "4px 8px" }}
                >
                  {row[col] != null ? row[col].toString() : ""}
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
x