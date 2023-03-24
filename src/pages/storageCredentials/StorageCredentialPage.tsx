import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  StorageCredential,
  StorageCredentialsApiAxiosParamCreator,
  RunAxios,
} from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

async function getStorageCredentialData(
  storageCredentialId: string
): Promise<StorageCredential> {
  // Generate axios parameter
  const StorageCredentialParamCreator =
    StorageCredentialsApiAxiosParamCreator();
  const getStorageCredentialsParam =
    await StorageCredentialParamCreator.getStorageCredential(
      storageCredentialId
    );

  // Calling axios
  const axiosData = await RunAxios(getStorageCredentialsParam);
  return axiosData.data;
}

function StorageCredentialPage() {
  const { storageCredentialId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [storageCredentialResponse, setStorageCredentialResponse] =
    useState<StorageCredential | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (storageCredentialId) {
          const data = await getStorageCredentialData(storageCredentialId);
          if (cancel) return;
          setStorageCredentialResponse(data);
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
  }, [storageCredentialId, setDialogInfo]);

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
          Storage Credential Id: {storageCredentialId}
        </Typography>
      </Grid>
      {!storageCredentialResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={storageCredentialResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default StorageCredentialPage;
