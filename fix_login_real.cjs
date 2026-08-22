const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Login.tsx', 'utf8');

const lines = code.split(/\r?\n/);
const pwIndex = lines.findIndex(l => l.includes('type="password"'));

if (pwIndex >= 0) {
  let startDiv = pwIndex;
  while(startDiv > 0 && !lines[startDiv].includes('<label')) startDiv--;
  startDiv--; 
  let endDiv = pwIndex;
  while(endDiv < lines.length && !lines[endDiv].includes('</div>')) endDiv++;
  
  const newBlock = `            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#125c3a] focus:border-[#125c3a] outline-none transition-colors text-gray-800"
                  placeholder="Password"
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>`;
  
  lines.splice(startDiv, endDiv - startDiv + 1, newBlock);
  code = lines.join('\n');
}

fs.writeFileSync('client/src/pages/Login.tsx', code);
console.log('Fixed login file via node!');
