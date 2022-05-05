import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import { ProjectBundleList, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../../container/app/DialogContext";
import CustomTable, {
  IColumnMapping,
  IPaginationProps,
  paginationPropsInit,
  getTotalItemCountFromRes,
} from "../../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
  {
    displayName: "Id",
    jsonKeys: ["bundle", "id"],
    linkTo: { formatString: "{0}", formatValue: [["bundle", "id"]] },
  },
  { displayName: "Name", jsonKeys: ["bundle", "name"] },
  {
    displayName: "Short Description",
    jsonKeys: ["bundle", "shortDescription"],
  },
  { displayName: "Release Version", jsonKeys: ["bundle", "releaseVersion"] },
  { displayName: "Version Comment", jsonKeys: ["bundle", "versionComment"] },
  { displayName: "Status", jsonKeys: ["bundle", "status"] },
  { displayName: "Time Created", jsonKeys: ["bundle", "timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["bundle", "timeModified"] },
];

async function getProjectBundleListPages(
  projectId: string
): Promise<ProjectBundleList> {

  const axiosData = await RunAxios({url:`/api/projects/${projectId}/bundles`});

  return axiosData.data;
}

function ProjectBundleListPage() {
  const [projectBundleListResponse, setProjectBundleListResponse] =
    useState<ProjectBundleList | null>();
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
    setProjectBundleListResponse(null);
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectBundleListPages(projectId);
          if (cancel) return;

          setProjectBundleListResponse(data);
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
        <Typography variant="h4">Project Bundle List</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
      </Grid>
      {!projectBundleListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectBundleListResponse.items}
              columnMapping={COLUMN_MAPPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectBundleListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectBundleListPage;
