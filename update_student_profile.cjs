const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentProfile.tsx', 'utf8');

// Add className to the initial state
code = code.replace(
  'email: student.email || "",',
  'email: student.email || "",\n      className: student.className || "",'
);

// Add className to the form
const classNameField = `
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                  <input className="w-full p-2 border rounded" value={editForm.className} onChange={e => setEditForm({...editForm, className: e.target.value})} />
                </div>
`;
code = code.replace(
  '<label className="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>',
  '</label></div>' + classNameField + '<div><label className="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>'
);
// Above regex is bad, let's just use string replacement on a specific block.

code = code.replace(
  '<div>\n                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>',
  classNameField + '<div>\n                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>'
);

// Wait, the block looks like:
/*
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>
                  <input className="w-full p-2 border rounded" value={editForm.academicSession} onChange={e => setEditForm({...editForm, academicSession: e.target.value})} />
                </div>
*/

fs.writeFileSync('client/src/pages/StudentProfile.tsx', code);
