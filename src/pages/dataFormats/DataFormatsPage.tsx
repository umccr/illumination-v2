import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import {
  DataFormatPagedList,
  DataFormatApiAxiosParamCreator,
  RunAxios,
} from "icats";

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
  { displayName: "Code", jsonKeys: ["code"] },
  { displayName: "Description", jsonKeys: ["description"] },
  { displayName: "ID", jsonKeys: ["id"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getDataFormatData(parameter: any): Promise<DataFormatPagedList> {
  // Generate axios parameter
  const DataFormatParamCreator = DataFormatApiAxiosParamCreator();
  const getDataFormatsParam = await DataFormatParamCreator.getDataFormats();

  getDataFormatsParam.url += `?`;
  for (const element in parameter) {
    getDataFormatsParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getDataFormatsParam);
  return axiosData.data;
}

function DataFormatsPage() {
  const [projectListResponse, setDataFormatListResponse] =
    useState<DataFormatPagedList | null>();
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
        const data = await getDataFormatData(apiParameter);
        if (cancel) return;

        setDataFormatListResponse(data);
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
        <Typography variant="h4">Available Data Formats</Typography>
      </Grid>

      {!projectListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectListResponse.items}
              columnMapping={COLUMN_MAPPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default DataFormatsPage;
