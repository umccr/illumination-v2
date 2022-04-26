import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectAnalysisApiAxiosParamCreator,
  AnalysisStepList,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

// Helper function
async function getProjectAnalysesStepData(
  projectId: string,
  analysisId: string
): Promise<AnalysisStepList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectAnalysisApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getAnalysisSteps(
    projectId,
    analysisId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

// Main function
function ProjectAnalysesStepPage() {
  const { projectId, analysisId } = useParams();
  const { setDialogInfo } = useDialogContext();

  const [analysisStepResponse, setAnalysisStepResponse] =
    useState<AnalysisStepList | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      if (projectId && analysisId) {
        try {
          const data = await getProjectAnalysesStepData(projectId, analysisId);
          if (cancel) return;

          setAnalysisStepResponse(data);
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
  }, [projectId, analysisId, setDialogInfo, setAnalysisStepResponse]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Analysis Steps</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Analysis Id: {analysisId}</Typography>
      </Grid>
      {!analysisStepResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={analysisStepResponse.items} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={analysisStepResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectAnalysesStepPage;
