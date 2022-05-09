import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import {
  AnalysisStorageList,
  AnalysisStorageApiAxiosParamCreator,
  RunAxios,
} from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
  { displayName: "Name", jsonKeys: ["name"] },
  { displayName: "ID", jsonKeys: ["id"] },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Description", jsonKeys: ["description"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getAnalysisStorageData(): Promise<AnalysisStorageList> {
  // Generate axios parameter
  const analysisStorageParamCreator = AnalysisStorageApiAxiosParamCreator();
  const getAnalysisStorageParam =
    await analysisStorageParamCreator.getAnalysisStorageOptions();

  // Calling axios
  const axiosData = await RunAxios(getAnalysisStorageParam);
  return axiosData.data;
}

function AnalysisStoragePage() {
  const [analysisStorageListResponse, setAnalysisStorageListResponse] =
    useState<AnalysisStorageList | null>();
  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getAnalysisStorageData();
        if (cancel) return;

        setAnalysisStorageListResponse(data);
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
        <Typography variant="h4">Analysis Storage</Typography>
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

export default AnalysisStoragePage;
