import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import {
  NotificationChannelList,
  NotificationChannelApiAxiosParamCreator,
  RunAxios,
} from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, {
  IColumnMapping,
  IPaginationProps,
  paginationPropsInit,
  getTotalItemCountFromRes,
} from "../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
  {
    displayName: "ID",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  { displayName: "Address", jsonKeys: ["address"] },
  { displayName: "Type", jsonKeys: ["type"] },

  { displayName: "Owner Id", jsonKeys: ["ownerId"] }, 
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Enabled", jsonKeys: ["enabled"] },

  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getNotificationChannelsData(
  parameter: any
): Promise<NotificationChannelList> {
  // Generate axios parameter
  const NotificationChannelsParamCreator =
    NotificationChannelApiAxiosParamCreator();
  const getNotificationChannelsParam =
    await NotificationChannelsParamCreator.getNotificationChannels();

  getNotificationChannelsParam.url += `?`;
  for (const element in parameter) {
    getNotificationChannelsParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getNotificationChannelsParam);
  return axiosData.data;
}

function NotificationChannelsPage() {
  const [notificationChannelListResponse, setNotificationChannelListResponse] =
    useState<NotificationChannelList | null>();
  const [paginationProps, setPaginationProps] =
    useState<IPaginationProps>(paginationPropsInit);
  function handlePaginationPropsChange(newProps: any) {
    setPaginationProps((prev) => ({ ...prev, ...newProps }));
  }

  const [apiParameter, setApiParameter] = useState({
    pageOffset: 0,
    pageSize: paginationProps.rowsPerPage,
  });

  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    // Calculate pageOffset
    const pageOffset: number =
      paginationProps.currentPageNumber * paginationProps.rowsPerPage;

    setApiParameter({
      pageOffset: pageOffset,
      pageSize: paginationProps.rowsPerPage,
    });
  }, [paginationProps.rowsPerPage, paginationProps.currentPageNumber]);

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getNotificationChannelsData(apiParameter);
        if (cancel) return;

        setNotificationChannelListResponse(data);
        handlePaginationPropsChange({
          totalItem: getTotalItemCountFromRes(data),
        });
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
  }, [apiParameter, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Available Notification Channels</Typography>
      </Grid>

      {!notificationChannelListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={notificationChannelListResponse.items}
              columnMapping={COLUMN_MAPPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={notificationChannelListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default NotificationChannelsPage;
