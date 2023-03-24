import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { Workgroup, WorkgroupApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

async function getWorkgroupData(workgroupId: string): Promise<Workgroup> {
  // Generate axios parameter
  const WorkgroupParamCreator = WorkgroupApiAxiosParamCreator();
  const getWorkgroupsParam = await WorkgroupParamCreator.getWorkgroup(
    workgroupId
  );

  // Calling axios
  const axiosData = await RunAxios(getWorkgroupsParam);
  return axiosData.data;
}

function WorkgroupPage() {
  const { workgroupId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [workgroupResponse, setWorkgroupResponse] =
    useState<Workgroup | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (workgroupId) {
          const data = await getWorkgroupData(workgroupId);
          if (cancel) return;
          setWorkgroupResponse(data);
        }
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
  }, [workgroupId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Workgroup Id: {workgroupId}</Typography>
      </Grid>
      {!workgroupResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={workgroupResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default WorkgroupPage;
