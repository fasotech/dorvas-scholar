const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

code = code.replace(
  'import { useAuth } from "@/_core/hooks/useAuth";',
  'import { useAuth } from "@/_core/hooks/useAuth";\nimport AvatarUploader from "../components/AvatarUploader";'
);

code = code.replace(
  '<span className="avatar top-avatar">{initials}</span>',
  '<AvatarUploader initials={initials} currentPicture={user?.profilePicture} size="sm" />'
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
