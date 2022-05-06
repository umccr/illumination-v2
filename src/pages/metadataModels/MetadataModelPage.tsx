import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { MetadataModel, MetadataModelApiAxiosParamCreator, RunAxios } from "icats";


// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import ChipArray, { IButtonProps } from "../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Fields", route: "fields" },
];

async function getMetadataModelData(metadataModelId: string): Promise<MetadataModel> {
  // Generate axios parameter
  const MetadataModelParamCreator = MetadataModelApiAxiosParamCreator();
  const getMetadataModelsParam = await MetadataModelParamCreator.getMetadataModel(metadataModelId);

  // Calling axios
  const axiosData = await RunAxios(getMetadataModelsParam);
  return axiosData.data;
}

function MetadataModelPage() {
  const { metadataModelId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [metadataModelResponse, setMetadataModelResponse] = useState<MetadataModel | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (metadataModelId) {
          const data = await getMetadataModelData(metadataModelId);
          if (cancel) return;
          setMetadataModelResponse(data);
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
        <Typography variant="h4">Metadata Model Id: {metadataModelId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!metadataModelResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={metadataModelResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default MetadataModelPage;
