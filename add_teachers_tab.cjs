const fs = require('fs');

// 1. Update server/services/school.ts
let svc = fs.readFileSync('server/services/school.ts', 'utf8');
svc = svc.replace(
  'export const dashboardSections = ["students", "classes", "attendance", "exams", "results", "fees", "announcements", "calendar", "settings"] as const;',
  'export const dashboardSections = ["students", "teachers", "classes", "attendance", "exams", "results", "fees", "announcements", "calendar", "settings"] as const;'
);
svc = svc.replace(
  'students: { columns: ["Student", "Admission no.", "Status", "Created"], model: Student, fields: ["fullName", "admissionNumber", "status", "createdAt"] },',
  'students: { columns: ["Student", "Admission no.", "Status", "Created"], model: Student, fields: ["fullName", "admissionNumber", "status", "createdAt"] },\n  teachers: { columns: ["Teacher", "Status", "Created"], model: Teacher, fields: ["fullName", "status", "createdAt"] },'
);
fs.writeFileSync('server/services/school.ts', svc);

// 2. Update client/src/pages/Home.tsx
let home = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');
home = home.replace(
  '{ label: "Overview", key: "overview", icon: LayoutDashboard }, { label: "Students", key: "students", icon: Users },',
  '{ label: "Overview", key: "overview", icon: LayoutDashboard }, { label: "Students", key: "students", icon: Users },\n  { label: "Teachers", key: "teachers", icon: Users },'
);
home = home.replace(
  'primary: ["students", "classes", "attendance", "exams", "results", "fees"],',
  'primary: ["students", "teachers", "classes", "attendance", "exams", "results", "fees"],'
);

// Add default data block for Teachers if missing in Workspace
home = home.replace(
  'settings: { primary: "New academic session", secondary: "System configuration", note: "Manage academic years and grading periods", icon: Settings }',
  'settings: { primary: "New academic session", secondary: "System configuration", note: "Manage academic years and grading periods", icon: Settings },\n  teachers: { primary: "New Teacher", secondary: "Teacher roster", note: "Manage teaching staff", icon: Users }'
);

fs.writeFileSync('client/src/pages/Home.tsx', home);
