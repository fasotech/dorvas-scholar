const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');
code = code.replace(
  'import { useState, useMemo } from "react";',
  'import { useState, useMemo } from "react";\nimport { useQueryClient } from "@tanstack/react-query";'
);
code = code.replace('payload.totalAmount = Number(payload.totalAmount);', 'payload.totalAmount = Number(payload.totalAmount) as any;');
fs.writeFileSync('client/src/pages/Home.tsx', code);
