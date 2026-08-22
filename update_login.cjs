const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Login.tsx', 'utf8');

if (!code.includes('Eye, EyeOff')) {
  code = code.replace(
    'import { useQueryClient } from "@tanstack/react-query";',
    'import { useQueryClient } from "@tanstack/react-query";\nimport { Eye, EyeOff } from "lucide-react";'
  );
}

if (!code.includes('showPassword')) {
  code = code.replace(
    '  const [password, setPassword] = useState("");',
    '  const [password, setPassword] = useState("");\n  const [showPassword, setShowPassword] = useState(false);'
  );
}

if (!code.includes('relative')) {
  code = code.replace(
    '            <div>\n              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Password</label>\n              <input \n                type="password" \n                value={password}\n                onChange={e => setPassword(e.target.value)}\n                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#125c3a] focus:border-[#125c3a] outline-none transition-colors text-gray-800"\n                placeholder="••••••••"\n                required \n              />\n            </div>',
    `            <div>
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
            </div>`
  );
}

fs.writeFileSync('client/src/pages/Login.tsx', code);
console.log('Done Login.tsx');
