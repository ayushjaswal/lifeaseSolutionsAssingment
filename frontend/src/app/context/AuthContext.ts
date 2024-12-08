// context/AuthContext.js
import { createContext, useState, useContext } from 'react';

export interface AuthContextInterface {
  username: string
}
// Create a context with a default value
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext); // Custom hook for easy access

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<AuthContextInterface | null>(null);

  // Function to set user (e.g., after login)
  const login = (userData: AuthContextInterface) => setUser(userData);

  // Function to logout
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider >{} </AuthContext.Provider>
  )
};
