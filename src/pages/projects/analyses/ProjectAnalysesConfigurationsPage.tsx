import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectAnalysisApiAxiosParamCreator,
  ExecutionConfigurationList,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

// Helper function
async function getProjectAnalysesConfigurationsData(
  projectId: string,
  analysisId: string
): Promise<ExecutionConfigurationList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectAnalysisApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getAnalysisConfigurations(
    projectId,
    analysisId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

// Main function
function ProjectAnalysesConfigurationsPage() {
  const { projectId, analysisId } = useParams();
  const { setDialogInfo } = useDialogContext();

  const [analysisConfigurationsResponse, setAnalysisConfigurationsResponse] =
    useState<ExecutionConfigurationList | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      if (projectId && analysisId) {
        try {
          const data = await getProjectAnalysesConfigurationsData(
            projectId,
            analysisId
          );
          if (cancel) return;

          setAnalysisConfigurationsResponse(data);
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
  }, [projectId, analysisId, setDialogInfo, setAnalysisConfigurationsResponse]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Analysis Configurations</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Analysis Id: {analysisId}</Typography>
      </Grid>
      {!analysisConfigurationsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={analysisConfigurationsResponse} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={analysisConfigurationsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectAnalysesConfigurationsPage;
