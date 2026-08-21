const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentProfile.tsx', 'utf8');

// 1. Add className to the setEditForm initialization
code = code.replace(
  'address: student.address || "",',
  'className: student.className || "",\n      address: student.address || "",'
);

// 2. Add className to the form JSX. The user wants it in the form.
// Let's put it right after Full Name.
const nameBlock = '<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>\n                  <input required className="w-full p-2 border rounded" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />';

const classNameBlock = `
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input className="w-full p-2 border rounded" value={editForm.className || ""} onChange={e => setEditForm({...editForm, className: e.target.value})} />`;

code = code.replace(nameBlock, nameBlock + classNameBlock);

// 3. Also make sure the display section has Class in the grid!
// Currently the display section has:
/*
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label><div className="font-medium">{student.email || "—"}</div></div>
*/
// Wait, in line 228 it displays Email, Telephone, etc.
// Let's add Class to the display grid as well if it's not there.
const emailDisplayBlock = '<div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label><div className="font-medium">{student.email || "—"}</div></div>';
const classDisplayBlock = '<div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Class</label><div className="font-medium">{student.className || "—"}</div></div>\n              ' + emailDisplayBlock;

code = code.replace(emailDisplayBlock, classDisplayBlock);


fs.writeFileSync('client/src/pages/StudentProfile.tsx', code);
console.log("StudentProfile.tsx updated.");
