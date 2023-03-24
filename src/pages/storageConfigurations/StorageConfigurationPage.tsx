import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  StorageConfiguration,
  StorageConfigurationApiAxiosParamCreator,
  RunAxios,
} from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import ChipArray, { IButtonProps } from "../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [{ name: "Details", route: "details" }];

async function getStorageConfigurationData(
  storageConfigurationId: string
): Promise<StorageConfiguration> {
  // Generate axios parameter
  const StorageConfigurationParamCreator =
    StorageConfigurationApiAxiosParamCreator();
  const getStorageConfigurationsParam =
    await StorageConfigurationParamCreator.getStorageConfiguration(
      storageConfigurationId
    );

  // Calling axios
  const axiosData = await RunAxios(getStorageConfigurationsParam);
  return axiosData.data;
}

function StorageConfigurationPage() {
  const { storageConfigurationId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [storageConfigurationResponse, setStorageConfigurationResponse] =
    useState<StorageConfiguration | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (storageConfigurationId) {
          const data = await getStorageConfigurationData(
            storageConfigurationId
          );
          if (cancel) return;
          setStorageConfigurationResponse(data);
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
      <ChipArray data={buttonProps} />
      {!storageConfigurationResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={storageConfigurationResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default StorageConfigurationPage;
