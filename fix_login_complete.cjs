const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Login.tsx', 'utf8');

const targetStr = '<div>\\n              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Password</label>\\n              <input \\n                type="password" \\n                value={password}\\n                onChange={e => setPassword(e.target.value)}\\n                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#125c3a] focus:border-[#125c3a] outline-none transition-colors text-gray-800"\\n                placeholder=""\\n                required \\n              />\\n            </div>';

const targetStr2 = '<div>\\r\\n              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Password</label>\\r\\n              <input \\r\\n                type="password" \\r\\n                value={password}\\r\\n                onChange={e => setPassword(e.target.value)}\\r\\n                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#125c3a] focus:border-[#125c3a] outline-none transition-colors text-gray-800"\\r\\n                placeholder=""\\r\\n                required \\r\\n              />\\r\\n            </div>';

let match = code.indexOf(targetStr) !== -1 ? targetStr : targetStr2;

if (code.includes('placeholder=""')) {
  // Manual string replace
  const lines = code.split(/\\r?\\n/);
  const pwIndex = lines.findIndex(l => l.includes('placeholder=""'));
  if (pwIndex >= 0) {
    // Find the <div> block
    let startDiv = pwIndex;
    while(startDiv > 0 && !lines[startDiv].includes('<label')) startDiv--;
    startDiv--; // To include <div>
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
    code = lines.join('\\n');
  }
}

fs.writeFileSync('client/src/pages/Login.tsx', code);
console.log('Done fixing Login.tsx completely');
