import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { ProjectDataApiAxiosParamCreator, ProjectList, RunAxios } from "icats";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

// Helper function
async function getProjectChildrenData(
  projectId: string,
  dataId: string
): Promise<ProjectList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectDataApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getProjectDataChildren(
    projectId,
    dataId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

// Main function
function ProjectDataChildrenPage() {
  const { projectId, dataId } = useParams();
  const { setDialogInfo } = useDialogContext();

  const [dataChildrenResponse, setDataChildrenResponse] =
    useState<ProjectList | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      if (projectId && dataId) {
        try {
          const data = await getProjectChildrenData(projectId, dataId);
          if (cancel) return;

          setDataChildrenResponse(data);
        } catch (err) {
          setDialogInfo({
            isOpen: true,
            dialogTitle: "Error",
            dialogContent: `Sorry, An error has occurred while fetching the API (${err}). Please try again!`,
          });
        }
      }
    }

    fetchData();
    return () => {
      cancel = true;
    };
  }, [projectId, dataId, setDialogInfo, setDataChildrenResponse]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Data Children Projects</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Data Id: {dataId}</Typography>
      </Grid>
      {!dataChildrenResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={dataChildrenResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectDataChildrenPage;
