const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Modify the map over records
// Old: records.length ? records.map((row: string[], rowIndex: number) => <tr key={`${row.join("-")}-${rowIndex}`}>{row.map((cell: string, index: number) => <td key={`${cell}-${index}`}>{index === 0 ? <b>{cell}</b> : index === row.length - 1 ? <span className="status-pill">{cell}</span> : cell}</td>)}</tr>)
const oldMap = 'records.length ? records.map((row: string[], rowIndex: number) => <tr key={`${row.join("-")}-${rowIndex}`}>{row.map((cell: string, index: number) => <td key={`${cell}-${index}`}>{index === 0 ? <b>{cell}</b> : index === row.length - 1 ? <span className="status-pill">{cell}</span> : cell}</td>)}</tr>) : <tr>';

const newMap = `records.length ? records.map((rowItem: any, rowIndex: number) => {
  const cells = Array.isArray(rowItem) ? rowItem : rowItem.cells;
  const id = Array.isArray(rowItem) ? null : rowItem.id;
  const isClickable = id && section === "students";
  return (
    <tr 
      key={id || rowIndex} 
      onClick={() => isClickable && window.location.assign("/students/" + id)}
      style={{ cursor: isClickable ? "pointer" : "default" }}
      className={isClickable ? "hover:bg-gray-50 transition-colors" : ""}
    >
      {cells.map((cell: string, index: number) => 
        <td key={index}>{index === 0 ? <b>{cell}</b> : index === cells.length - 1 ? <span className="status-pill">{cell}</span> : cell}</td>
      )}
    </tr>
  );
}) : <tr>`;

code = code.replace(oldMap, newMap);
fs.writeFileSync('client/src/pages/Home.tsx', code);
