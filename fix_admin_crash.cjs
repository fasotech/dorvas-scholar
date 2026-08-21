const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  'import { Users, GraduationCap, School, BookOpen, Clock, Activity, ArrowRight, TrendingUp } from "lucide-react";',
  'import { Users, GraduationCap, School, BookOpen, Clock, Activity, ArrowRight, TrendingUp, CalendarDays } from "lucide-react";'
);

fs.writeFileSync('client/src/pages/AdminDashboard.tsx', code);
