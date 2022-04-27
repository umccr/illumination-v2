import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import {
  ProjectBaseJobApiAxiosParamCreator,
  BaseJobList,
  RunAxios,
} from "icats";

// Custom components
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
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
  {
    displayName: "Table Id",
    jsonKeys: ["table", "id"],
    linkTo: { formatString: "{0}", formatValue: [["table", "id"]] },
  },
  { displayName: "Table Status", jsonKeys: ["table", "status"] },
  {
    displayName: "Table Number Of Records",
    jsonKeys: ["table", "numberOfRecords"],
  },
  { displayName: "Table Data Size", jsonKeys: ["table", "dataSize"] },
];

async function getProjectBasePages(projectId: string): Promise<BaseJobList> {

  // Generate axios parameter
  const ProjectParamCreator = ProjectBaseJobApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getBaseJobs(projectId);

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);

  return axiosData.data
}

function ProjectBaseJobsPage() {
  const [projectBaseJobsResponse, setProjectBaseJobsResponse] =
    useState<BaseJobList | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectBasePages(projectId);
          if (cancel) return;

          setProjectBaseJobsResponse(data);
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
        <Typography variant="h4">Project Base Jobs</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
      </Grid>

      {!projectBaseJobsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectBaseJobsResponse.items}
              columnMapping={COLUMN_MAPPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectBaseJobsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectBaseJobsPage;
