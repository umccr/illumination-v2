import React, { useEffect, useState } from "react";
import {
  ProjectApiAxiosParamCreator,
  ProjectPagedList,
} from "../../openapi/api";
import { runAxios } from "../../utils/axios";
import { Grid } from "@mui/material";

// Import custom component
import OverviewProject from "../../container/overviewProject/OverviewProject";
import MainHomeChip from "../../container/mainHomeChip/MainHomeChip";
import OtherHomeChip from "../../container/otherMenuChip/OtherMenuChip";

async function getProjectData(): Promise<ProjectPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectApiAxiosParamCreator();
  const getProjectsParamter = await ProjectParamCreator.getProjects();

  // Calling axios
  const axiosData = await runAxios(getProjectsParamter);
  return axiosData.data;
}

function HomePage() {
  const [projectList, setProjectList] = useState<ProjectPagedList>({
    items: [],
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getProjectData();
      setProjectList(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs={12}>
          <OverviewProject projectData={projectList} />
        </Grid>

        <Grid item xs={12}>
          <MainHomeChip />
        </Grid>
        <Grid item xs={12}>
          <OtherHomeChip />
        </Grid>
      </Grid>
    </>
  );
}

export default HomePage;
