import React, { useContext, createContext, useState, useEffect } from "react";

import DialogTokenForm from "../../components/Dialog/DialogTokenForm";

// Interface
interface iProviderprops {
  children?: React.ReactNode;
}

interface userType {
  ica_token: string;
}

// Default value
const userContext = {
  user: { ica_token: "" },
  setUser: (user: userType) => {},
};

function UserContextProvider(props: iProviderprops) {
  const [user, setUser] = useState(userContext.user);

  function handleChangeToken(token: string) {
    setUser({ ...user, ica_token: token });
  }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {!user.ica_token ? (
        <DialogTokenForm handleIcaTokenChange={handleChangeToken} />
      ) : (
        <></>
      )}

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
