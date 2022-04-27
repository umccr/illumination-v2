import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { ProjectDataApiAxiosParamCreator, DataList, RunAxios } from "icats";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

// Helper function
async function getProjectDataLinkedData(
  projectId: string,
  dataId: string
): Promise<DataList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectDataApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getProjectsLinkedToData(
    projectId,
    dataId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

// Main function
function ProjectDataLinkedPage() {
  const { projectId, dataId } = useParams();
  const { setDialogInfo } = useDialogContext();

  const [dataLinkedResponse, setDataLinkedResponse] =
    useState<DataList | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      if (projectId && dataId) {
        try {
          const data = await getProjectDataLinkedData(
            projectId,
            dataId
          );
          if (cancel) return;

          setDataLinkedResponse(data);
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
  }, [projectId, dataId, setDialogInfo, setDataLinkedResponse]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Data Linked Projects</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Data Id: {dataId}</Typography>
      </Grid>
      {!dataLinkedResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={dataLinkedResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectDataLinkedPage;
