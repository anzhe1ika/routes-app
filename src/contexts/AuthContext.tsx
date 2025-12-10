import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  emailVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock user data
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      firstName: "Іван",
      lastName: "Іванов",
      middleName: "Іванович",
      phone: "+380998887766",
      dateOfBirth: "2000-01-01",
      emailVerified: true,
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const register = async (
    email: string,
    _password: string,
    firstName: string,
    lastName: string
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create new user (email not verified initially)
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      emailVerified: false,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("pendingEmailVerification", "true");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("pendingEmailVerification");
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const verifyEmail = async (_token: string) => {
    if (!user) throw new Error("No user logged in");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedUser = { ...user, emailVerified: true };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.removeItem("pendingEmailVerification");
  };

  const requestPasswordReset = async (_email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real implementation, this would send an email
  };

  const resetPassword = async (_token: string, _newPassword: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real implementation, this would reset the password
  };

  const resendVerificationEmail = async () => {
    if (!user) throw new Error("No user logged in");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real implementation, this would resend the verification email
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

