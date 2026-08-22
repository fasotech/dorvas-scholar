const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

code = code.replace(
  `<input 
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }}
                value={formData[f.key] || ""}
                onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
              />`,
  `<input 
                required={f.key !== 'email'}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }}
                value={formData[f.key] || ""}
                onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
              />`
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
console.log('Done fixing Home.tsx');
