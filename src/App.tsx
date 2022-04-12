import React from "react";
import NavigationBar from "./container/app/NavigationBar";
import UserContext from "./container/app/UserContext";
import DialogComponent from "./container/app/DialogContext";
import AppRoutes from "./AppRoutes";

// MaterialUI Component
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

function App() {
  return (
    <Box
      aria-label="Base Box"
      sx={{ flexGrow: 1, height: "100vh", minWidth: "500px" }}
    >
      <DialogComponent>
        <UserContext>
          <NavigationBar />
          <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
            <AppRoutes />
          </Container>
        </UserContext>
      </DialogComponent>
    </Box>
  );
}

export default App;
