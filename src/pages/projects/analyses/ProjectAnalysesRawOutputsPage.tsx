import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectAnalysisApiAxiosParamCreator,
  AnalysisRawOutput,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

// Helper function
async function getProjectAnalysesRawOutputsData(
  projectId: string,
  analysisId: string
): Promise<AnalysisRawOutput> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectAnalysisApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.hGetExecutionOutputObject(
    projectId,
    analysisId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

// Main function
function ProjectAnalysesRawOutputsPage() {
  const { projectId, analysisId } = useParams();
  const { setDialogInfo } = useDialogContext();

  const [analysisRawOutputsResponse, setAnalysisRawOutputsResponse] =
    useState<AnalysisRawOutput | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      if (projectId && analysisId) {
        try {
          const data = await getProjectAnalysesRawOutputsData(
            projectId,
            analysisId
          );
          if (cancel) return;

          setAnalysisRawOutputsResponse(data);
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
  }, [projectId, analysisId, setDialogInfo, setAnalysisRawOutputsResponse]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Analysis RawOutputs</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Analysis Id: {analysisId}</Typography>
      </Grid>
      {!analysisRawOutputsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={analysisRawOutputsResponse} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={analysisRawOutputsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectAnalysesRawOutputsPage;
