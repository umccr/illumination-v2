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
  { name: "Analysis Storage", route: "/analysisStorage" },
  { name: "Data Formats", route: "/dataFormats" },
  { name: "Event Codes", route: "/eventCodes" },
  { name: "Event Log", route: "/eventLog" },
  // { name: "Metadata Models", route: "/metadataModels" },
  // { name: "Region", route: "/regions" },
  // {
  //   name: "Notification Channgel (403 Currently)",
  //   route: "/notificationChannel",
  // },
  // { name: "Storage Bundles", route: "/storageBundles" },
  // { name: "Storage Configurations", route: "/storageConfigurations" },
  // { name: "Storage Credentials", route: "/storageCredentials" },
];

function OtherHomeChip() {
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
        OTHER MENU
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

export default OtherHomeChip;
