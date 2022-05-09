import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { FieldList, MetadataModelApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

async function getMetadataModelFieldData(
  MetadataModelId: string
): Promise<FieldList> {
  // Generate axios parameter
  const MetadataModelFieldParamCreator = MetadataModelApiAxiosParamCreator();
  const getMetadataModelFieldsParam =
    await MetadataModelFieldParamCreator.getMetadataModelFields(
      MetadataModelId
    );

  // Calling axios
  const axiosData = await RunAxios(getMetadataModelFieldsParam);
  return axiosData.data;
}

function MetadataModelFieldPage() {
  const { metadataModelId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [metadataModelFieldResponse, setMetadataModelFieldResponse] =
    useState<FieldList | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (metadataModelId) {
          const data = await getMetadataModelFieldData(metadataModelId);
          if (cancel) return;
          setMetadataModelFieldResponse(data);
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
  }, [metadataModelId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Metadata Model Field</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Metadata Model Id: {metadataModelId}
        </Typography>
      </Grid>
      {!metadataModelFieldResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={metadataModelFieldResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default MetadataModelFieldPage;
