import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectNotificationSubscriptionsApiAxiosParamCreator,
  NotificationSubscription,
  RunAxios,
} from "icats";

// JSON to table
import JSONToTable from "../../../components/JSONToTable/JSONToTable";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

async function getProjectNotificationData(
  projectId: string,
  subId: any
): Promise<NotificationSubscription> {
  // Generate axios parameter
  const ProjectParamCreator =
    ProjectNotificationSubscriptionsApiAxiosParamCreator();
  const getProjectsParam =
    await ProjectParamCreator.getNotificationSubscription1(projectId, subId);

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

function ProjectNotificationPage() {
  const [ProjectNotificationResponse, setProjectNotificationResponse] =
    useState<NotificationSubscription | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId, subId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectNotificationData(projectId, subId);
          if (cancel) return;

          setProjectNotificationResponse(data);
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
  }, [subId, setDialogInfo, projectId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Notification</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Subscription Id: {subId}</Typography>
      </Grid>
      {!ProjectNotificationResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONToTable JSONData={ProjectNotificationResponse} />
          </Grid>

          <Grid item xs={12}>
            <JSONContainer data={ProjectNotificationResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectNotificationPage;
