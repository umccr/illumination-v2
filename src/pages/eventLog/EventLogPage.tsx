import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { EventLogList, EventLogApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  { displayName: "User Id", jsonKeys: ["userId"] },
  { displayName: "Description", jsonKeys: ["description"] },
  { displayName: "Id", jsonKeys: ["id"] },
  { displayName: "Code", jsonKeys: ["code"] },
  { displayName: "Event Type Category", jsonKeys: ["eventTypeCategory"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getEventLogData(): Promise<EventLogList> {
  // Generate axios parameter
  const eventLogParamCreator = EventLogApiAxiosParamCreator();
  const getEventLogParam = await eventLogParamCreator.getEventLogs();

  // Calling axios
  const axiosData = await RunAxios(getEventLogParam);
  return axiosData.data;
}

function EventLogPage() {
  const [eventLogListResponse, setEventLogListResponse] =
    useState<EventLogList | null>();
  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getEventLogData();
        if (cancel) return;

        setEventLogListResponse(data);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent: `Sorry, An error has occurred while fetching the API (${err}). Please try again!`,
        });
      }
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, [setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Event Logs</Typography>
      </Grid>

      {!eventLogListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={eventLogListResponse.items}
              columnMapping={COLUMN_MAPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={eventLogListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default EventLogPage;
