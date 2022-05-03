import React from "react";
import { Grid, Typography } from "@mui/material";
function NotFoundPage() {
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
          Sorry, we cannot find the page you are looking for!
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          (Check the URL)
        </Typography>
      </Grid>
    </>
  );
}

export default NotFoundPage;
