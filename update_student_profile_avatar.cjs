const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentProfile.tsx', 'utf8');

code = code.replace(
  'import { Button } from "@/components/ui/button";',
  'import { Button } from "@/components/ui/button";\nimport AvatarUploader from "../components/AvatarUploader";'
);

const avatarBlock = `<div className="w-24 h-24 bg-[#1b4332] text-white rounded-full flex items-center justify-center text-3xl font-bold shrink-0">\n            {student.fullName.charAt(0)}\n          </div>`;
const newAvatarBlock = `<AvatarUploader \n            id={student._id}\n            type="Student"\n            currentPicture={student.profilePicture}\n            initials={student.fullName.charAt(0)}\n            size="xl"\n          />`;

code = code.replace(avatarBlock, newAvatarBlock);

fs.writeFileSync('client/src/pages/StudentProfile.tsx', code);
