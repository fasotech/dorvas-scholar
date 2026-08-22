const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Login.tsx', 'utf8');

const regex = /<div>\s*<label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Password<\/label>\s*<input[^>]+type="password"[^>]+>\s*<\/div>/m;

code = code.replace(regex, `<div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#125c3a] focus:border-[#125c3a] outline-none transition-colors text-gray-800"
                  placeholder="••••••••"
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>`);

fs.writeFileSync('client/src/pages/Login.tsx', code);
console.log('Done fixing Login.tsx');
