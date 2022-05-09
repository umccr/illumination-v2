import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  NotificationChannel,
  NotificationChannelApiAxiosParamCreator,
  RunAxios,
} from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

async function getNotificationChannelData(
  notificationChannelId: string
): Promise<NotificationChannel> {
  // Generate axios parameter
  const NotificationChannelParamCreator = NotificationChannelApiAxiosParamCreator();
  const getNotificationChannelsParam =
    await NotificationChannelParamCreator.getNotificationChannel(notificationChannelId);

  // Calling axios
  const axiosData = await RunAxios(getNotificationChannelsParam);
  return axiosData.data;
}

function NotificationChannelPage() {
  const { notificationChannelId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [notificationChannelResponse, setNotificationChannelResponse] =
    useState<NotificationChannel | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (notificationChannelId) {
          const data = await getNotificationChannelData(notificationChannelId);
          if (cancel) return;
          setNotificationChannelResponse(data);
        }
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent: `Sorry, An error has occured while fetching the API (${err}). Please try again!`,
        });
      }
    }
    fetchData();
    return () => {
      cancel = true;
    };
  }, [notificationChannelId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          Notification Channel Id: {notificationChannelId}
        </Typography>
      </Grid>
      {!notificationChannelResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={notificationChannelResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default NotificationChannelPage;
