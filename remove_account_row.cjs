const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const targetStr = '<div className="account-row"><span className="avatar account">{initials}</span><div><b>{dashboardQuery.data?.identity.displayName ?? user?.name ?? "Signed-in user"}</b><span>{schoolRole ?? "School profile pending"}</span></div></div>';

if (code.includes(targetStr)) {
  code = code.replace(targetStr, '');
  fs.writeFileSync('client/src/pages/Home.tsx', code);
  console.log("Success");
} else {
  console.log("Target string not found.");
}
