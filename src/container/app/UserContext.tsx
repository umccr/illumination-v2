import React, { useContext, createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";

import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

import { SetToken } from "icats";
import { get_secret_manager_value } from "../../utils/AWS";

// Interface
interface iProviderprops {
  children?: React.ReactNode;
}

// Default value
const userContext = {
  user: {
    isSignedIn: false,
    currentAuthenticatedUser: {},
  },
  setUser: (user: any) => {},
};

function getAuthUser() {
  return Auth.currentAuthenticatedUser()
    .then((userData) => userData)
    .catch(() => console.log("Not signed in"));
}

function getCredsUser() {
  return Auth.currentUserCredentials()
    .then((userData) => userData)
    .catch(() => console.log("Not signed in"));
}

function UserContextProvider(props: iProviderprops) {
  const [user, setUser] = useState(userContext.user);
  const [isAuthenticating, setIsAuthenticating] = useState<Boolean>(true);

  useEffect(() => {
    async function onLoad() {
      try {
        await Auth.currentSession();

        setUser({
          isSignedIn: true,
          currentAuthenticatedUser: await getAuthUser(),
        });

        // SetToken from SecretManager
        const ica_jwt = await get_secret_manager_value(
          await getCredsUser(),
          "IcaSecretsPortal"
        );
        SetToken(process.env.REACT_APP_ICAV2_JWT ?? ica_jwt);
        
      } catch (e) {
        setUser({
          isSignedIn: false,
          currentAuthenticatedUser: {},
        });
      }

      setIsAuthenticating(false);
    }
    onLoad();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {isAuthenticating ? (
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            paddingTop: "25rem",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress sx={{ margin: "1rem" }} />
          <Typography>Authenticating ...</Typography>
        </Container>
      ) : (
        props.children
      )}
    </UserContext.Provider>
  );
}

// Export functions
export const UserContext = createContext(userContext);
export function useUserContext() {
  return useContext(UserContext);
}
export default UserContextProvider;
