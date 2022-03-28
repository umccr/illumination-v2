import React, { useContext, createContext, useState, useEffect } from "react";
import DialogTokenForm from "../../components/Dialog/DialogTokenForm";

import {configure}  from "../../openapi/middlelayer"

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
  const [isDialogTokenOpen, setIsDialogTokenOpen] = useState<boolean>(true)

  function handleChangeToken(token: string) {
    setUser({ ...user, ica_token: token });
  }
  
  function handleDialogClose(){
    if (user.ica_token){
      setIsDialogTokenOpen(false);
    }
  }

  useEffect(() => {
    if (user.ica_token) {
      setIsDialogTokenOpen(false);
      configure( user.ica_token );
    } else {
      setIsDialogTokenOpen(true);
    }
  }, [user.ica_token]);
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {isDialogTokenOpen ? (
        <DialogTokenForm
          handleIcaTokenChange={handleChangeToken}
          handleDialogClose={handleDialogClose}
        />
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
