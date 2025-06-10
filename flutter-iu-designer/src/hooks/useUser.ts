import { useState } from "react";

export function useUser() {
  const [user, setUser] = useState({
    name: "Ellen Templar",
    email: "ellen.templar@company.com",
    role: "Marketing",
  });

  // Aquí luego puedes agregar lógica para fetch/update
  return { user, setUser };
}