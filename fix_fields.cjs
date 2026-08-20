const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Update students fields
code = code.replace(
  '{ key: "fullName", label: "Full Name" },',
  '{ key: "fullName", label: "Full Name" },\n      { key: "className", label: "Class Name" },'
);
code = code.replace(
  '{ key: "state", label: "State" },',
  '{ key: "state", label: "State" },\n      { key: "email", label: "Email (Leave blank to auto-generate)" },'
);

// Update teachers fields
code = code.replace(
  'case "teachers": return [\n      { key: "fullName", label: "Full Name" },\n      { key: "password", label: "Initial Password (for login)" }',
  'case "teachers": return [\n      { key: "fullName", label: "Full Name" },\n      { key: "address", label: "Address" },\n      { key: "email", label: "Email (Leave blank to auto-generate)" },\n      { key: "password", label: "Initial Password (for login)" }'
);

// Update Modal size and grid
code = code.replace(
  '<div className="create-panel" style={{ width: 400, padding: 24 }}>',
  '<div className="create-panel" style={{ width: fields.length > 4 ? 600 : 400, padding: 24 }}>'
);
code = code.replace(
  '<form onSubmit={handleSubmit} style={{ display: \'flex\', flexDirection: \'column\', gap: 12 }}>',
  '<form onSubmit={handleSubmit} style={{ display: \'grid\', gridTemplateColumns: fields.length > 4 ? \'1fr 1fr\' : \'1fr\', gap: 16 }}>'
);
code = code.replace(
  '<div className="panel-actions" style={{ marginTop: 16, display: \'flex\', justifyContent: \'flex-end\', gap: 12 }}>',
  '<div className="panel-actions" style={{ marginTop: 16, display: \'flex\', justifyContent: \'flex-end\', gap: 12, gridColumn: \'1 / -1\' }}>'
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
