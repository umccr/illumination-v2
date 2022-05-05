import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { Bundle, BundleApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import ChipArray, { IButtonProps } from "../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Data", route: "data" },
  { name: "Pipelines", route: "pipelines" },
  { name: "Samples", route: "samples" },
  { name: "Tools", route: "tools" },
  { name: "Tools Eligible For Linking", route: "tools/eligibleForLinking" },
];

async function getBundleData(bundleId: string): Promise<Bundle> {
  // Generate axios parameter
  const BundleParamCreator = BundleApiAxiosParamCreator();
  const getBundlesParam = await BundleParamCreator.getBundle(bundleId);

  // Calling axios
  const axiosData = await RunAxios(getBundlesParam);
  return axiosData.data;
}

function BundlePage() {
  const { bundleId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [bundleResponse, setBundleResponse] = useState<Bundle | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (bundleId) {
          const data = await getBundleData(bundleId);
          if (cancel) return;
          setBundleResponse(data);
        }
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent: `Sorry, An error has occured while fetching the API (${err}). Please try again!`,
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
        <Typography variant="h4">Bundle</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Bundle Id: {bundleId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!bundleResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={bundleResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default BundlePage;
