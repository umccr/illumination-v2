import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { EventCodeList, EventCodeApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  { displayName: "Event Code", jsonKeys: ["eventCode"] },
  { displayName: "Description", jsonKeys: ["description"] },
];

async function getEventCodeData(): Promise<EventCodeList> {
  // Generate axios parameter
  const eventCodeParamCreator = EventCodeApiAxiosParamCreator();
  const getEventCodeParam = await eventCodeParamCreator.getEventCodes();

  // Calling axios
  const axiosData = await RunAxios(getEventCodeParam);
  return axiosData.data;
}

function EventCodePage() {
  const [eventCodeListResponse, setEventCodeListResponse] =
    useState<EventCodeList | null>();
  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getEventCodeData();
        if (cancel) return;

        setEventCodeListResponse(data);
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
        <Typography variant="h4">Event Codes</Typography>
      </Grid>

      {!eventCodeListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={eventCodeListResponse.items}
              columnMapping={COLUMN_MAPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={eventCodeListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default EventCodePage;
