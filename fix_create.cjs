const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Change label
code = code.replace(
  '{ key: "email", label: "Email (Leave blank to auto-generate)" }',
  '{ key: "email", label: "Email Address" }'
);

const newBlock = `          {fields.map(f => {
            const isEmailAuto = (f.key === 'email' && (section === 'students' || section === 'teachers'));
            const displayValue = isEmailAuto && !formData[f.key] && formData.fullName 
                ? formData.fullName.toLowerCase().replace(/\\s+/g, '.') + '@dorvas.edu.ng' 
                : (formData[f.key] || "");
            
            return (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
              <input 
                required={f.key !== 'email'}
                disabled={isEmailAuto}
                style={{ 
                  width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6,
                  backgroundColor: isEmailAuto ? '#f5f5f5' : 'white',
                  color: isEmailAuto ? '#666' : 'inherit'
                }}
                value={displayValue}
                placeholder={isEmailAuto ? "Auto-generated..." : ""}
                onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
              />
              {isEmailAuto && (
                <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4, fontWeight: 500 }}>
                  ✓ Email will auto-generate based on this name.
                </div>
              )}
            </div>
            );
          })}`;

code = code.replace(
  /\{\s*fields\.map\(f\s*=>\s*\([\s\S]*?\)\s*\)\s*\}/m,
  newBlock
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
console.log('Done CreatePanel');
