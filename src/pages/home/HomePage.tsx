import React, { useEffect, useState } from "react";

import { Grid } from "@mui/material";

// Import custom component
import OverviewProject from "../../container/overviewProject/OverviewProject";
import MainHomeChip from "../../container/mainHomeChip/MainHomeChip";
import OtherHomeChip from "../../container/otherMenuChip/OtherMenuChip";



function HomePage() {

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs={12}>
          <OverviewProject/>
        </Grid>

        <Grid item xs={12}>
          <MainHomeChip />
        </Grid>
        <Grid item xs={12}>
          <OtherHomeChip />
        </Grid>
      </Grid>
    </>
  );
}

export default HomePage;
