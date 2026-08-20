const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const newFields = `
  // Define fields based on section
  const fields = useMemo(() => {
    switch (section) {
      case "students": return [
        { key: "fullName", label: "Full Name" }, 
        { key: "admissionNumber", label: "Admission Number" },
        { key: "dob", label: "Date of Birth (YYYY-MM-DD)" },
        { key: "address", label: "Address" },
        { key: "state", label: "State" },
        { key: "password", label: "Initial Password (for login)" }
      ];
      case "teachers": return [
        { key: "fullName", label: "Full Name" },
        { key: "password", label: "Initial Password (for login)" }
      ];
      case "classes": return [{ key: "name", label: "Class Name" }, { key: "code", label: "Class Code" }, { key: "gradeLevel", label: "Grade Level" }];
      case "attendance": return [{ key: "studentId", label: "Student Name/ID" }, { key: "status", label: "Status (present/absent)" }];
      case "exams": return [{ key: "title", label: "Assessment Title" }, { key: "examType", label: "Type (Quiz, Final)" }];
      case "results": return [{ key: "studentId", label: "Student Name/ID" }, { key: "percentage", label: "Percentage Score" }, { key: "grade", label: "Letter Grade" }];
      case "fees": return [{ key: "name", label: "Fee Name" }, { key: "totalAmount", label: "Amount (Numbers only)" }];
      case "announcements": return [{ key: "title", label: "Announcement Title" }, { key: "priority", label: "Priority (low, normal, high)" }];
      case "calendar": return [{ key: "title", label: "Event Title" }, { key: "startsAt", label: "Start Date (YYYY-MM-DD)" }];
      case "settings": return [{ key: "name", label: "Session Name" }];
      default: return [{ key: "name", label: "Name" }];
    }
  }, [section]);
`;

code = code.replace(/\/\/ Define fields based on section[\s\S]*?\}, \[section\]\);/, newFields.trim());
fs.writeFileSync('client/src/pages/Home.tsx', code);
