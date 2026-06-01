import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const BASE_URL = "https://inspector-api-five.vercel.app/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/auth/me?t=${Date.now()}`, {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          setUser({
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            picture: data.data.avatar_url,
          });
        } else {
          await refreshAccessToken();
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const handleOAuthCallback = (accessToken, refreshToken, userData) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      picture: userData.avatar_url,
    });
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await res.json();
      if (data.status === "success") {
        localStorage.setItem("accessToken", data.data.accessToken);
        return data.data.accessToken;
      }
    } catch {
      logout();
    }
    return null;
  };

  const loginWithGoogle = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  const registerWithGoogle = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  // Fix: update name bukan username
  const updateUsername = (name) => {
    setUser((prev) => ({ ...prev, name }));
  };

  const getToken = () => localStorage.getItem("accessToken");

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      registerWithGoogle,
      handleOAuthCallback,
      refreshAccessToken,
      logout,
      updateUsername,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
