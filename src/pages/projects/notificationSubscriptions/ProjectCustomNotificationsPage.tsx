import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import {
  ProjectCustomNotificationSubscriptionsApiAxiosParamCreator,
  CustomNotificationSubscriptionList,
  RunAxios,
} from "icats";

// Custom components
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
  {
    displayName: "Notification Channel Id",
    jsonKeys: ["notificationChannel", "id"],
    linkTo: {
      formatString: "{0}",
      formatValue: [["notificationChannel", "id"]],
    },
  },
  {
    displayName: "Time Created",
    jsonKeys: ["notificationChannel", "timeCreated"],
  },
  {
    displayName: "Time Modified",
    jsonKeys: ["notificationChannel", "timeModified"],
  },
  { displayName: "Owner Id", jsonKeys: ["notificationChannel", "ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["notificationChannel", "tenantId"] },
  {
    displayName: "Tenant Name",
    jsonKeys: ["notificationChannel", "tenantName"],
  },
  {
    displayName: "Enabled",
    jsonKeys: ["notificationChannel", "enabled"],
  },
  {
    displayName: "Type",
    jsonKeys: ["notificationChannel", "type"],
  },
  {
    displayName: "Address",
    jsonKeys: ["notificationChannel", "address"],
  },
];

async function getProjectBasePages(
  projectId: string
): Promise<CustomNotificationSubscriptionList> {
  // Generate axios parameter
  const ProjectParamCreator =
    ProjectCustomNotificationSubscriptionsApiAxiosParamCreator();
  const getProjectsParam =
    await ProjectParamCreator.getNotificationSubscriptions(projectId);

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);

  return axiosData.data;

}

function ProjectCustomNotificationsPage() {
  const [
    projectCustomNotificationsResponse,
    setProjectCustomNotificationsResponse,
  ] = useState<CustomNotificationSubscriptionList | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectBasePages(projectId);
          if (cancel) return;

          setProjectCustomNotificationsResponse(data);
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
        <Typography variant="h4">Project Custom Notifications</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
      </Grid>

      {!projectCustomNotificationsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectCustomNotificationsResponse.items}
              columnMapping={COLUMN_MAPPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectCustomNotificationsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectCustomNotificationsPage;
