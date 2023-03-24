import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import {
  ProjectPipelineApiAxiosParamCreator,
  ProjectPipelineList,
  RunAxios,
} from "icats";

// Custom components
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../../container/app/DialogContext";
import CustomTable, {
  IColumnMapping,
  IPaginationProps,
  paginationPropsInit,
  getTotalItemCountFromRes,
} from "../../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  {
    displayName: "Id",
    jsonKeys: ["pipeline", "id"],
    linkTo: { formatString: "{0}", formatValue: [["pipeline", "id"]] },
  },
  { displayName: "Code", jsonKeys: ["pipeline", "code"] },
  { displayName: "Description", jsonKeys: ["pipeline", "description"] },
  { displayName: "Language", jsonKeys: ["pipeline", "language"] },
  { displayName: "Time Created", jsonKeys: ["pipeline", "timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["pipeline", "timeModified"] },
];

async function getProjectPipelineListPages(
  projectId: string,
  parameter: any
): Promise<ProjectPipelineList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectPipelineApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getProjectPipelines(
    projectId
  );

  getProjectsParam.url += `?`;
  for (const element in parameter) {
    getProjectsParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

function ProjectPipelineListJobsPage() {
  const [projectPipelineListJobsResponse, setProjectPipelineListJobsResponse] =
    useState<ProjectPipelineList | null>();
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
  const { projectId } = useParams();

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
    setProjectPipelineListJobsResponse(null);
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectPipelineListPages(
            projectId,
            apiParameter
          );
          if (cancel) return;

          setProjectPipelineListJobsResponse(data);
          handlePaginationPropsChange({
            totalItem: getTotalItemCountFromRes(data),
          });
        } catch (err) {
          setDialogInfo({
            isOpen: true,
            dialogTitle: "Error",
            dialogContent: `Sorry, An error has occurred while fetching the API (${err}). Please try again!`,
          });
        }
      }
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, [apiParameter, setDialogInfo, projectId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project Pipeline List</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
      </Grid>
      {!projectPipelineListJobsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectPipelineListJobsResponse.items}
              columnMapping={COLUMN_MAPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectPipelineListJobsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectPipelineListJobsPage;
