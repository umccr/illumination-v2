import React from "react";
import NavigationBar from "./container/app/NavigationBar";
import UserContext from "./container/app/UserContext";

// MaterialUI Component
import Box from "@mui/material/Box";

function App() {
  return (
    <Box
      aria-label="Base Box"
      sx={{ flexGrow: 1, height: "100vh", minWidth: "500px" }}
    >
      <NavigationBar />
        <UserContext>
          <></>
        </UserContext>
    </Box>
  );
}

export default App;
