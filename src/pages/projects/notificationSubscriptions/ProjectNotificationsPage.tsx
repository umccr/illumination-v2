import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import {
  ProjectNotificationSubscriptionsApiAxiosParamCreator,
  NotificationSubscriptionList,
  RunAxios,
} from "icats";

// Custom components
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  {
    displayName: "Id",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
];

async function getProjectBasePages(
  projectId: string
): Promise<NotificationSubscriptionList> {
  // Generate axios parameter
  const ProjectParamCreator =
    ProjectNotificationSubscriptionsApiAxiosParamCreator();
  const getProjectsParam =
    await ProjectParamCreator.getNotificationSubscriptions1(projectId);

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);

  return axiosData.data;
}

function ProjectNotificationsPage() {
  const [projectNotificationsResponse, setProjectNotificationsResponse] =
    useState<NotificationSubscriptionList | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectBasePages(projectId);
          if (cancel) return;

          setProjectNotificationsResponse(data);
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
  }, [setDialogInfo, projectId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Notifications</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
      </Grid>

      {!projectNotificationsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectNotificationsResponse.items}
              columnMapping={COLUMN_MAPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectNotificationsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectNotificationsPage;
