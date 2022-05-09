import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  StorageConfigurationDetails,
  StorageConfigurationApiAxiosParamCreator,
  RunAxios,
} from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";


async function getStorageConfigurationDetailsData(
  StorageConfigurationId: string
): Promise<StorageConfigurationDetails> {
  // Generate axios parameter
  const StorageConfigurationDetailsParamCreator =
    StorageConfigurationApiAxiosParamCreator();
  const getStorageConfigurationDetailssParam =
    await StorageConfigurationDetailsParamCreator.getStorageConfigurationDetails(
      StorageConfigurationId
    );

  // Calling axios
  const axiosData = await RunAxios(getStorageConfigurationDetailssParam);
  return axiosData.data;
}

function StorageConfigurationDetailsPage() {
  const { StorageConfigurationId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [storageConfigurationDetail, setStorageConfigurationDetailsResponse] = useState<
    StorageConfigurationDetails | null | any
  >();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (StorageConfigurationId) {
          const data = await getStorageConfigurationDetailsData(
            StorageConfigurationId
          );
          if (cancel) return;
          setStorageConfigurationDetailsResponse(data);
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
  }, [StorageConfigurationId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          Storage Configuration Id: {StorageConfigurationId}
        </Typography>
      </Grid>
      {!storageConfigurationDetail ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={storageConfigurationDetail} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default StorageConfigurationDetailsPage;
