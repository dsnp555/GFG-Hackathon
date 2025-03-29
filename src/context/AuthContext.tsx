import React, { createContext, useContext, useState } from 'react';
import type { User, AuthContextType } from '../types';
import usersData from '../data/users.json';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const foundUser = usersData.users.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    
    setUser(foundUser);
  };

  const signup = async (newUser: Omit<User, 'id'>) => {
    const userExists = usersData.users.some((u) => u.email === newUser.email);
    
    if (userExists) {
      throw new Error('User already exists');
    }
    
    const user = {
      ...newUser,
      id: `${newUser.role[0]}${usersData.users.length + 1}`,
    };
    
    usersData.users.push(user);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};