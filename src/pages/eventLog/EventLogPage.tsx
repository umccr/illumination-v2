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

const COLUMN_MAPPPING: IColumnMapping[] = [
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
  const analysisStorageParamCreator = EventLogApiAxiosParamCreator();
  const getEventLogParam = await analysisStorageParamCreator.getEventLogs();

  // Calling axios
  const axiosData = await RunAxios(getEventLogParam);
  return axiosData.data;
}

function EventLogPage() {
  const [analysisStorageListResponse, setEventLogListResponse] =
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
          dialogContent: `Sorry, An error has occured while fetching the API (${err}). Please try again!`,
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

      {!analysisStorageListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={analysisStorageListResponse.items}
              columnMapping={COLUMN_MAPPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={analysisStorageListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default EventLogPage;
