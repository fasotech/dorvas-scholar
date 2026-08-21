const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

code = code.replace(
  '</div><button onClick={() => void logout()} aria-label="Sign out"><LogOut size={17} /></button></div></aside>',
  '</div></div></aside>'
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
