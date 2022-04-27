import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectBaseJobApiAxiosParamCreator,
  BaseJob,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";


async function getProjectBaseJobData(
  projectId: string,
  baseJobId: any
): Promise<BaseJob> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectBaseJobApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getBaseJob(
    projectId,
    baseJobId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;

}

function ProjectBaseJobPage() {
  const [ProjectBaseJobResponse, setProjectBaseJobResponse] =
    useState<BaseJob | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId, baseJobId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectBaseJobData(projectId, baseJobId);
          if (cancel) return;

          setProjectBaseJobResponse(data);
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
  }, [baseJobId, setDialogInfo, projectId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Base Job</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Base Job Id: {baseJobId}</Typography>
      </Grid>
      {!ProjectBaseJobResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={ProjectBaseJobResponse} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={ProjectBaseJobResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectBaseJobPage;
