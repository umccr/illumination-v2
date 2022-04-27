import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { ProjectDataApiAxiosParamCreator, Data, RunAxios } from "icats";

// Custom component
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import ChipArray, {
  IButtonProps,
} from "../../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Children", route: "children" },
  { name: "Linked Project", route: "linkedProject" },
  { name: "Secondary Data", route: "secondaryData" },
];

async function getProjectData(projectId: string, dataId: any): Promise<Data> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectDataApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getProjectData(
    projectId,
    dataId
  );

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

function ProjectDataPage() {
  const [projectDataResponse, setProjectDataResponse] = useState<Data | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId, dataId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectData(projectId, dataId);
          if (cancel) return;

          setProjectDataResponse(data);
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
  }, [dataId, setDialogInfo, projectId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Data</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
        <Typography variant="subtitle1">Data Id: {dataId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!projectDataResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={projectDataResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectDataPage;
