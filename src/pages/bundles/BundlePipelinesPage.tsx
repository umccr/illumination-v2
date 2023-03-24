import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  BundlePipelineList,
  BundlePipelineApiAxiosParamCreator,
  RunAxios,
} from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

async function getBundlePipelinesData(
  bundleId: string
): Promise<BundlePipelineList> {
  // Generate axios parameter
  const BundlePipelinesParamCreator = BundlePipelineApiAxiosParamCreator();
  const getBundlePipelinessParam =
    await BundlePipelinesParamCreator.getBundlePipelines(bundleId);

  // Calling axios
  const axiosData = await RunAxios(getBundlePipelinessParam);
  return axiosData.data;
}

function BundlePipelinesPage() {
  const { bundleId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [bundlePipelinesResponse, setBundlePipelinesResponse] =
    useState<BundlePipelineList | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (bundleId) {
          const data = await getBundlePipelinesData(bundleId);
          if (cancel) return;
          setBundlePipelinesResponse(data);
        }
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent: `Sorry, An error has occurred while fetching the API (${err}). Please try again!`,
        });
      }
    }
    fetchData();
    return () => {
      cancel = true;
    };
  }, [bundleId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">BundlePipelines</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          BundlePipelines Id: {bundleId}
        </Typography>
      </Grid>
      {!bundlePipelinesResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={bundlePipelinesResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default BundlePipelinesPage;
