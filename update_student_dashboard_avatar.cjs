const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentDashboard.tsx', 'utf8');

code = code.replace(
  'import { Button } from "@/components/ui/button";',
  'import { Button } from "@/components/ui/button";\nimport AvatarUploader from "../components/AvatarUploader";'
);

const avatarBlock = `          <div className="w-36 h-36 bg-white rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
            {student.photograph ? (
              <img src={student.photograph} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl text-[#2d6a4f] font-serif">{student.fullName?.charAt(0) || "S"}</span>
            )}
          </div>`;
          
const newAvatarBlock = `          <div className="w-36 h-36 shrink-0 relative group">
            <AvatarUploader 
              id={student._id}
              type="Student"
              currentPicture={student.profilePicture || student.photograph}
              initials={student.fullName?.charAt(0) || "S"}
              size="xl"
            />
          </div>`;

code = code.replace(avatarBlock, newAvatarBlock);

fs.writeFileSync('client/src/pages/StudentDashboard.tsx', code);
