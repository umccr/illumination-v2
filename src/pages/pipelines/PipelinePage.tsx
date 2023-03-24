import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { Pipeline, PipelineApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import ChipArray, { IButtonProps } from "../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Input Parameters", route: "inputParameters" },
  { name: "Reference Sets", route: "referenceSets" },
];

async function getPipelineData(pipelineId: string): Promise<Pipeline> {
  // Generate axios parameter
  const PipelineParamCreator = PipelineApiAxiosParamCreator();
  const getPipelinesParam = await PipelineParamCreator.getPipeline(pipelineId);

  // Calling axios
  const axiosData = await RunAxios(getPipelinesParam);
  return axiosData.data;
}

function PipelinePage() {
  const { pipelineId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [pipelineResponse, setPipelineResponse] = useState<Pipeline | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (pipelineId) {
          const data = await getPipelineData(pipelineId);
          if (cancel) return;
          setPipelineResponse(data);
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
  }, [pipelineId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Pipeline</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Pipeline Id: {pipelineId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!pipelineResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={pipelineResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default PipelinePage;
