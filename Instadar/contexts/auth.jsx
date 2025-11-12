import { getItemAsync } from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";


export const AuthContext = createContext({
  isLoggedIn: false,
  user: {},
  login: () => { },
  logout: () => { },
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    // baca token
    getItemAsync('token').then(async token => {
      // kalau ada token, set isLoggedIn true
      if (token) {
        const userData = await getItemAsync('user');
        // Optionally, fetch user data here and setUser
        if (userData) {
          login(JSON.parse(userData));
        }
      }
    })
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    console.log("Logout pressed from context ✅");
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setIsLoggedIn(false);
      setUser({});
      console.log("Token & user deleted ✅");
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}