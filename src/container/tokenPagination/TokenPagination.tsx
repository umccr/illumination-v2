import React from "react";
import { Paper, Grid, Typography, IconButton } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

export interface ITokenPaginationData {
  totalRecord: number;
  remainingRecord: number;
  prevPageToken: string;
  nextPageToken: string;
}

export const tokenPaginationInit: ITokenPaginationData = {
  totalRecord: 0,
  remainingRecord: 0,
  prevPageToken: "",
  nextPageToken: "",
};

interface ITokenPaginationProps {
  data: ITokenPaginationData;
  handleApiParameterChange: Function;
}

function TokenPagination(props: ITokenPaginationProps) {
  const { totalRecord, remainingRecord, prevPageToken, nextPageToken } =
    props.data;
  const handleApiParameterChange = props.handleApiParameterChange;

  return (
    <Paper elevation={3} sx={{ padding: "20px" }}>
      <Grid
        container
        direction="row"
        spacing={3}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          <Typography variant="h6">Token Pagination</Typography>
        </Grid>

        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={3}
        >
          <Grid item>
            <Typography variant="subtitle2">Total Records</Typography>
          </Grid>
          <Grid
            item
            sx={{ height: "40px", display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle2">{totalRecord}</Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={3}
        >
          <Grid item>
            <Typography variant="subtitle2">Remaining Records</Typography>
          </Grid>
          <Grid
            item
            sx={{ height: "40px", display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle2">{remainingRecord}</Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={3}
        >
          <Grid item>
            <Typography variant="subtitle2">Token Pagination Button</Typography>
          </Grid>
          <Grid
            item
            sx={{ height: "40px", display: "flex", alignItems: "center" }}
          >
            <IconButton
              onClick={() =>
                handleApiParameterChange({ pageToken: prevPageToken })
              }
              disabled={prevPageToken ? false : true}
              aria-label="Previous Page"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                handleApiParameterChange({ pageToken: nextPageToken })
              }
              disabled={nextPageToken ? false : true}
              aria-label="Next Page"
            >
              <LastPageIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TokenPagination;
