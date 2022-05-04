import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectPipelineApiAxiosParamCreator,
  ProjectPipeline,
  RunAxios,
} from "icats";

// Custom components
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import ChipArray, {
  IButtonProps,
} from "../../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Input Parameters", route: "inputParameters" },
  { name: "Reference Sets", route: "referenceSets" },
];

async function getProjectPipelineData(
  projectId: string,
  pipelineId: string
): Promise<ProjectPipeline> {
  // Generate axios parameter
  const ProjectPipelineParamCreator = ProjectPipelineApiAxiosParamCreator();
  const getProjectPipelinesParam =
    await ProjectPipelineParamCreator.getProjectPipeline(projectId, pipelineId);

  // Calling axios
  const axiosData = await RunAxios(getProjectPipelinesParam);
  return axiosData.data;
}

function ProjectPipelinePage() {
  const { projectId, pipelineId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [pipelineResponse, setProjectPipelineResponse] =
    useState<ProjectPipeline | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (pipelineId && projectId) {
          const data = await getProjectPipelineData(projectId, pipelineId);
          if (cancel) return;
          setProjectPipelineResponse(data);
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
  }, [pipelineId, projectId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Pipeline</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
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

export default ProjectPipelinePage;
