import React from "react";

import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { Link as RouterLink } from "react-router-dom";

interface IButtonProps {
  name: string;
  route: string;
}

const buttonProps: IButtonProps[] = [
  { name: "Projects", route: "/projects" },
  { name: "Pipeline", route: "/pipelines" },
  { name: "Bundles", route: "/bundles" },
  { name: "Users", route: "/users" },
  { name: "Workgroups", route: "/workgroups" },
  { name: "Regions", route: "/regions" },
  { name: "Samples (Use Regions Endpoint)", route: "/samples" },
  // { name: "Connectors", route: "/conectors" },
];

function MainHomeChip() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={3}
    >
      {/* TITLE */}
      <Grid item xs={12}>
        MAIN MENU
      </Grid>

      <Grid item container direction="row" xs={12} spacing={2}>
        {buttonProps.map((buttonProperties: IButtonProps, index: number) => (
          <Grid item key={index}>
            <Chip
              component={RouterLink}
              to={buttonProperties.route}
              label={buttonProperties.name}
              clickable
              style={{ minWidth: "100px" }}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default MainHomeChip;
