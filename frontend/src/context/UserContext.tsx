// UserContext.tsx
import { createContext, useContext, useState } from "react";

// Define el tipo de tu contexto
interface UserContextType {
  user: any; // Reemplaza 'any' con tu tipo de usuario
  setUser: (user: any) => void;
}

// Crea el contexto con un valor inicial null
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
