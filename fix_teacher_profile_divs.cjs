const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherProfile.tsx', 'utf8');

code = code.replace(
  '<div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Registered On</label><div className="font-medium text-gray-900">{new Date(teacher.createdAt).toLocaleDateString()}</div></div>\n        </div>\n      </main>',
  '<div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Registered On</label><div className="font-medium text-gray-900">{new Date(teacher.createdAt).toLocaleDateString()}</div></div>\n          </div>\n        </div>\n      </main>'
);

fs.writeFileSync('client/src/pages/TeacherProfile.tsx', code);
