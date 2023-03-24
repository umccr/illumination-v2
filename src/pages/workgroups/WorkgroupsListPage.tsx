import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { WorkgroupList, WorkgroupApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, {
  IColumnMapping,
  IPaginationProps,
  paginationPropsInit,
  getTotalItemCountFromRes,
} from "../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  {
    displayName: "ID",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  { displayName: "Name", jsonKeys: ["name"] },
  { displayName: "Description", jsonKeys: ["description"] },
];

async function getWorkgroupsData(parameter: any): Promise<WorkgroupList> {
  // Generate axios parameter
  const WorkgroupsParamCreator = WorkgroupApiAxiosParamCreator();
  const getWorkgroupsParam = await WorkgroupsParamCreator.getWorkgroups();

  getWorkgroupsParam.url += `?`;
  for (const element in parameter) {
    getWorkgroupsParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getWorkgroupsParam);
  return axiosData.data;
}

function WorkgroupsPage() {
  const [workgroupListResponse, setWorkgroupListResponse] =
    useState<WorkgroupList | null>();
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
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getWorkgroupsData(apiParameter);
        if (cancel) return;

        setWorkgroupListResponse(data);
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

    fetchData();

    return () => {
      cancel = true;
    };
  }, [apiParameter, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Available Workgroups</Typography>
      </Grid>

      {!workgroupListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={workgroupListResponse.items}
              columnMapping={COLUMN_MAPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={workgroupListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default WorkgroupsPage;
