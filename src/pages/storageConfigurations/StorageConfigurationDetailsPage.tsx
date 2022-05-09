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
  storageConfigurationId: string
): Promise<StorageConfigurationDetails> {
  // Generate axios parameter
  const StorageConfigurationDetailsParamCreator =
    StorageConfigurationApiAxiosParamCreator();
  const getStorageConfigurationDetailssParam =
    await StorageConfigurationDetailsParamCreator.getStorageConfigurationDetails(
      storageConfigurationId
    );

  // Calling axios
  const axiosData = await RunAxios(getStorageConfigurationDetailssParam);
  return axiosData.data;
}

function StorageConfigurationDetailsPage() {
  const { storageConfigurationId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [storageConfigurationDetailResponse, setStorageConfigurationDetailsResponse] = useState<
    StorageConfigurationDetails | null
  >();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (storageConfigurationId) {
          const data = await getStorageConfigurationDetailsData(
            storageConfigurationId
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
  }, [storageConfigurationId, setDialogInfo]);

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
          Storage Configuration Id: {storageConfigurationId}
        </Typography>
      </Grid>
      {!storageConfigurationDetailResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={storageConfigurationDetailResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default StorageConfigurationDetailsPage;
