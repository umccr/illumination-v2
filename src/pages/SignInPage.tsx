import React from "react";
import { Grid, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

function SignInPage() {
  return (
    <>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        sx={{ paddingTop: "100px", paddingBottom: "100px" }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome to Illumination!
        </Typography>
        <Typography align="center" sx={{ paddingTop: "25px" }}>
          <Link
            variant="h1"
            sx={{ fontSize: "16px" }}
            gutterBottom
            onClick={() =>
              Auth.federatedSignIn({
                provider: CognitoHostedUIIdentityProvider.Google,
              })
            }
          >
            Please Sign In
          </Link>
        </Typography>
      </Grid>
    </>
  );
}

export default SignInPage;
