const fs = require('fs');
let code = fs.readFileSync('client/src/components/AvatarUploader.tsx', 'utf8');

code = code.replace(/className=\{\\`relative group inline-block \\\$\{sizeClasses\[size\]\} shrink-0 rounded-full bg-\[\#1b4332\] text-white flex items-center justify-center font-bold overflow-hidden shadow-sm border-2 border-white\\`\}/, 'className={`relative group inline-block ${sizeClasses[size]} shrink-0 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold overflow-hidden shadow-sm border-2 border-white`}');

fs.writeFileSync('client/src/components/AvatarUploader.tsx', code);
