import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { Project, ProjectApiAxiosParamCreator, RunAxios } from "icats";

// JSON to table
import JSONToTable from "../../components/JSONToTable/JSONToTable";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import ChipArray, { IButtonProps } from "../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Analyses", route: "analyses" },
  { name: "Pipelines", route: "pipelines" },
  { name: "Bundles", route: "bundles" },
  { name: "Notification Subscriptions", route: "notificationSubscriptions" },
  {
    name: "Custom Notification Subscriptions",
    route: "customNotificationSubscriptions",
  },
  { name: "Permissions", route: "permissions" },
  { name: "Base Jobs", route: "base/jobs" },
  { name: "Base Tables", route: "base/tables" },
  { name: "Data", route: "Data" },
];

async function getProjectData(projectId: string): Promise<Project> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getProject(projectId);

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

function ProjectPage() {
  const { projectId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [projectResponse, setProjectResponse] = useState<Project | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (projectId) {
          const data = await getProjectData(projectId);
          if (cancel) return;
          setProjectResponse(data);
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
  }, [projectId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Id: {projectId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!projectResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={projectResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectPage;
