import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { PipelineList, PipelineApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  {
    displayName: "ID",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Code", jsonKeys: ["code"] },
  { displayName: "Description", jsonKeys: ["description"] },
  { displayName: "Language", jsonKeys: ["language"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getPipelinesData(): Promise<PipelineList> {
  // Generate axios parameter
  const PipelinesParamCreator = PipelineApiAxiosParamCreator();
  const getPipelinesParam = await PipelinesParamCreator.getPipelines();

  // Calling axios
  const axiosData = await RunAxios(getPipelinesParam);
  return axiosData.data;
}

function PipelinesPage() {
  const [pipelinesListResponse, setPipelinesListResponse] =
    useState<PipelineList | null>();

  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getPipelinesData();
        if (cancel) return;

        setPipelinesListResponse(data);
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
        <Typography variant="h4">Available Pipelines</Typography>
      </Grid>

      {!pipelinesListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={pipelinesListResponse.items}
              columnMapping={COLUMN_MAPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={pipelinesListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default PipelinesPage;
