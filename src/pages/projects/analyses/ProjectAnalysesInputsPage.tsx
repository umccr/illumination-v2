import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectAnalysisApiAxiosParamCreator,
  AnalysisInputList,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

// Helper function
async function getProjectAnalysesInputsData(
  projectId: string,
  analysisId: string
): Promise<AnalysisInputList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectAnalysisApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getAnalysisInputs(
    projectId,
    analysisId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

// Main function
function ProjectAnalysesInputsPage() {
  const { projectId, analysisId } = useParams();
  const { setDialogInfo } = useDialogContext();

  const [analysisInputsResponse, setAnalysisInputsResponse] =
    useState<AnalysisInputList | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      if (projectId && analysisId) {
        try {
          const data = await getProjectAnalysesInputsData(
            projectId,
            analysisId
          );
          if (cancel) return;

          setAnalysisInputsResponse(data);
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
  }, [projectId, analysisId, setDialogInfo, setAnalysisInputsResponse]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Analysis Inputs</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Analysis Id: {analysisId}</Typography>
      </Grid>
      {!analysisInputsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={analysisInputsResponse} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={analysisInputsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectAnalysesInputsPage;
