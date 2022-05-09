import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { Region, RegionApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

async function getRegionData(regionId: string): Promise<Region> {
  // Generate axios parameter
  const RegionParamCreator = RegionApiAxiosParamCreator();
  const getRegionsParam = await RegionParamCreator.getRegion(
    regionId
  );

  // Calling axios
  const axiosData = await RunAxios(getRegionsParam);
  return axiosData.data;
}

function RegionPage() {
  const { regionId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [regionResponse, setRegionResponse] = useState<Region | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (regionId) {
          const data = await getRegionData(regionId);
          if (cancel) return;
          setRegionResponse(data);
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
  }, [regionId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Region Id: {regionId}</Typography>
      </Grid>
      {!regionResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={regionResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default RegionPage;
