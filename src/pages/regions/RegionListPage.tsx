import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { RegionList, RegionApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, {
  IColumnMapping,
  IPaginationProps,
  paginationPropsInit,
  getTotalItemCountFromRes,
} from "../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
  {
    displayName: "ID",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  {
    displayName: "Samples",
    jsonKeys: "Samples",
    linkTo: { formatString: "/samples?region={0}", formatValue: [["id"]] },
  },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Country Tenant Name", jsonKeys: ["country", "tenantName"] },
  { displayName: "Country", jsonKeys: ["country", "name"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getRegionsData(parameter: any): Promise<RegionList> {
  // Generate axios parameter
  const RegionsParamCreator = RegionApiAxiosParamCreator();
  const getRegionsParam = await RegionsParamCreator.getRegions();

  getRegionsParam.url += `?`;
  for (const element in parameter) {
    getRegionsParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getRegionsParam);
  return axiosData.data;
}

function RegionsPage() {
  const [regionListResponse, setRegionListResponse] =
    useState<RegionList | null>();
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
        const data = await getRegionsData(apiParameter);
        if (cancel) return;

        setRegionListResponse(data);
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
        <Typography variant="h4">Available Regions</Typography>
      </Grid>

      {!regionListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={regionListResponse.items}
              columnMapping={COLUMN_MAPPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={regionListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default RegionsPage;
