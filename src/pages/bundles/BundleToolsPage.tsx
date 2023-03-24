import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  BundleToolApiAxiosParamCreator,
  BundleToolsList,
  RunAxios,
} from "icats";

import CustomTable, { IColumnMapping } from "../../container/table/Table";

// Custom component
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

const COLUMN_MAPPING: IColumnMapping[] = [
  {
    displayName: "cwlToolDefinition Value",
    jsonKeys: ["cwlToolDefinition", "value"],
  },
];

async function getBundleTools(bundleId: string): Promise<BundleToolsList> {
  // Generate axios parameter
  const BundleParamCreator = BundleToolApiAxiosParamCreator();
  const getBundlesParam = await BundleParamCreator.getBundleTools(bundleId);

  // Calling axios
  const axiosData = await RunAxios(getBundlesParam);
  return axiosData.data;
}

function BundleToolsPage() {
  const [bundleToolsResponse, setBundleToolsResponse] =
    useState<BundleToolsList | null>();

  const { setDialogInfo } = useDialogContext();
  const { bundleId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (bundleId) {
        try {
          const data = await getBundleTools(bundleId);
          if (cancel) return;

          setBundleToolsResponse(data);
        } catch (err) {
          setDialogInfo({
            isOpen: true,
            dialogTitle: "Error",
            dialogContent: `Sorry, An error has occurred while fetching the API (${err}). Please try again!`,
          });
        }
      }
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, [setDialogInfo, bundleId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Bundle Tools</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Bundle Id: {bundleId}</Typography>
      </Grid>
      {!bundleToolsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={bundleToolsResponse.items}
              columnMapping={COLUMN_MAPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={bundleToolsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default BundleToolsPage;
