import React from "react";

// React-Router-Dom components
import { Link as RouterLink } from "react-router-dom";

// MUI Component
import { Grid, Chip } from "@mui/material";

export interface IButtonProps {
  name: string;
  route: string;
}

export interface IChipArrayProps {
  data: IButtonProps[];
}

function ChipArray(props: IChipArrayProps) {
  const { data } = props;

  return (
    <Grid item container direction="row" xs={12} spacing={2}>
      {data.map((buttonProperties: IButtonProps, index: number) => (
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
  );
}

export default ChipArray;
