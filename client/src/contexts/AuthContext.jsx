// client/src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
}/api`;

// Export roles
export const ROLES = {
  ADMIN: "Admin",
  ANALYST: "Analyst",
  VIEWER: "Viewer",
};

// Export permissions
export const PERMISSIONS = {
  PERFORM_RESPONSE_ACTIONS: "perform_response_actions",
  MANAGE_USERS: "manage_users",
};

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 👈 NEW

  useEffect(() => {
    // Restore user from localStorage on mount
    const storedUser = localStorage.getItem("soc_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false); // 👈 Done loading
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("soc_user", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        toast.success("Login successful!");
        return response.data.user;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("soc_user");
    toast("You have been logged out.");
  };

  // Role → permissions map
  const rolePermissions = {
    [ROLES.ADMIN]: [
      PERMISSIONS.PERFORM_RESPONSE_ACTIONS,
      PERMISSIONS.MANAGE_USERS,
    ],
    [ROLES.ANALYST]: [PERMISSIONS.PERFORM_RESPONSE_ACTIONS],
    [ROLES.VIEWER]: [],
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    const permissionsForRole = rolePermissions[user.role] || [];
    return permissionsForRole.includes(permission);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading, // 👈 expose loading
    login,
    logout,
    ROLES,
    PERMISSIONS,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
