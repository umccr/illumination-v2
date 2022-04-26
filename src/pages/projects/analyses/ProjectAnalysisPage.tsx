import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectAnalysisApiAxiosParamCreator,
  AnalysisPagedList,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import ChipArray, {
  IButtonProps,
} from "../../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Steps", route: "steps" },
  { name: "Inputs", route: "inputs" },
  { name: "Outputs", route: "outputs" },
  { name: "Raw Outputs", route: "rawOutputs" },
  { name: "Configurations", route: "configurations" },
];

async function getProjectAnalysisData(
  projectId: string,
  analysisId: any
): Promise<AnalysisPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectAnalysisApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getAnalysis(
    projectId,
    analysisId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

function ProjectAnalysisPage() {
  const [projectAnalysisResponse, setProjectAnalysisResponse] =
    useState<AnalysisPagedList | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId, analysisId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectAnalysisData(projectId, analysisId);
          if (cancel) return;

          setProjectAnalysisResponse(data);
        } catch (err) {
          setDialogInfo({
            isOpen: true,
            dialogTitle: "Error",
            dialogContent: `Sorry, An error has occured while fetching the API (${err}). Please try again!`,
          });
        }
      }
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, [analysisId, setDialogInfo, projectId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Analyses</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Analysis Id: {analysisId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!projectAnalysisResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={projectAnalysisResponse} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={projectAnalysisResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectAnalysisPage;
