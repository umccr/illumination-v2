import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectDataTransferApiAxiosParamCreator,
  DataTransfer,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

// Helper function
async function getProjectDataTransferData(
  projectId: string,
  dataTransferId: string
): Promise<DataTransfer> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectDataTransferApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getDataTransfer(
    projectId,
    dataTransferId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

// Main function
function ProjectDataTransferPage() {
  const { projectId, dataTransferId } = useParams();
  const { setDialogInfo } = useDialogContext();

  const [dataTransferResponse, setDataTransferResponse] =
    useState<DataTransfer | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      if (projectId && dataTransferId) {
        try {
          const data = await getProjectDataTransferData(
            projectId,
            dataTransferId
          );
          if (cancel) return;

          setDataTransferResponse(data);
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
  }, [projectId, dataTransferId, setDialogInfo, setDataTransferResponse]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Data Transfer</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Data Transfer Id: {dataTransferId}</Typography>
      </Grid>
      {!dataTransferResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={dataTransferResponse} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={dataTransferResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectDataTransferPage;
