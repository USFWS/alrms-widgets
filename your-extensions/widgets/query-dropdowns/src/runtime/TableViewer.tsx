import React from "react";

const CSVTable = ({ csvString }) => {
  // Function to parse CSV string
  const parseCSV = (str) => {
    const rows = str.trim().split("\n");
    const headers = rows.shift().split(",");
    return rows.map((row) => {
      const values = row.split(",");
      return headers.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
    });
  };

  // Parsing the CSV string
  const data = parseCSV(csvString);

  // Rendering the table
  return (
    <table>
      <thead>
        <tr>
          {/* Render table headers */}
          {Object.keys(data[0]).map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Render table rows */}
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((value, colIndex) => (
              <td key={`${rowIndex}-${colIndex}`}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CSVTable;
