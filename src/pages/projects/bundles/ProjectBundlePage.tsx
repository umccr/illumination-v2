import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import { ProjectBundle, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../../container/app/DialogContext";

async function getProjectBundlePages(
  projectId: string,
  bundleId: string
): Promise<ProjectBundle> {
  const axiosData = await RunAxios({
    url: `/api/projects/${projectId}/bundles/${bundleId}`,
  });

  return axiosData.data;
}

function ProjectBundlePage() {
  const [projectBundleResponse, setProjectBundleResponse] =
    useState<ProjectBundle | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId, bundleId } = useParams();

  useEffect(() => {
    setProjectBundleResponse(null);
    let cancel = false;

    async function fetchData() {
      if (projectId && bundleId) {
        try {
          const data = await getProjectBundlePages(projectId, bundleId);
          if (cancel) return;

          setProjectBundleResponse(data);
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
  }, [setDialogInfo, projectId, bundleId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Bundle</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Bundle Id: {bundleId}</Typography>
      </Grid>
      {!projectBundleResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={projectBundleResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectBundlePage;
