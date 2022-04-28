import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import {
  ProjectDataApiAxiosParamCreator,
  DataPagedList,
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
import ChipArray, {
  IButtonProps,
} from "../../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Non Sample Data", route: "nonSampleData" },
  { name: "Eligible For Linking", route: "eligibleForLinking" },
];

const COLUMN_MAPPPING: IColumnMapping[] = [
  {
    displayName: "Data Id",
    jsonKeys: ["data", "id"],
    linkTo: { formatString: "{0}", formatValue: [["data", "id"]] },
  },
  { displayName: "Time Created", jsonKeys: ["data", "details", "timeCreated"] },
  {
    displayName: "Time Modified",
    jsonKeys: ["data", "details", "timeModified"],
  },
  { displayName: "Owner Id", jsonKeys: ["data", "details", "ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["data", "details", "tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["data", "details", "tenantName"] },
  {
    displayName: "Status",
    jsonKeys: ["data", "details", "status"],
  },
];

async function getProjectDataListPages(
  projectId: string,
  parameter: any
): Promise<DataPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectDataApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getProjectDataList(
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

function ProjectDataListJobsPage() {
  const [projectDataListJobsResponse, setProjectDataListJobsResponse] =
    useState<DataPagedList | null>();
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
    setProjectDataListJobsResponse(null);
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectDataListPages(projectId, apiParameter);
          if (cancel) return;

          setProjectDataListJobsResponse(data);
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
        <Typography variant="h4">Project Data List Jobs</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!projectDataListJobsResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectDataListJobsResponse.items}
              columnMapping={COLUMN_MAPPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectDataListJobsResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectDataListJobsPage;
