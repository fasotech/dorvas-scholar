
import { useState, useEffect } from "react";
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ name: "Adiela Sam", email: "adielasam2015@gmail.com" });
  return { user, loading, isAuthenticated, logout: async () => { setIsAuthenticated(false) } };
}

