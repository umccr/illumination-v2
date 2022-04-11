import React, { useContext, createContext, useState } from "react";

// Interface
interface iProviderprops {
  children?: React.ReactNode;
}

// Default value
const userContext = {
  user: {},
  setUser: (user: any) => {},
};

function UserContextProvider(props: iProviderprops) {
  const [user, setUser] = useState(userContext.user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

// Export functions
export const UserContext = createContext(userContext);
export function useUserContext() {
  return useContext(UserContext);
}
export default UserContextProvider;
