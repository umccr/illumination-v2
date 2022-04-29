import React, { useContext, createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

// Interface
interface iProviderprops {
  children?: React.ReactNode;
}

// Default value
const userContext = {
  user: {},
  setUser: (user: any) => {},
};

function getUser() {
  return Auth.currentAuthenticatedUser()
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
        getUser().then((userData) => setUser(userData));
      } catch (e) {
        if (e !== "No current user") {
        }
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
