import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  BundleDataApiAxiosParamCreator,
  BundleDataPagedList,
  RunAxios,
} from "icats";

import CustomTable, {
  IColumnMapping,
  IPaginationProps,
  paginationPropsInit,
  getTotalItemCountFromRes,
} from "../../container/table/Table";

// Custom component
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";

const COLUMN_MAPPPING: IColumnMapping[] = [
  { displayName: "ID", jsonKeys: ["data", "id"] },
  { displayName: "Name", jsonKeys: ["data", "details", "name"] },
  { displayName: "Path", jsonKeys: ["data", "details", "path"] },
  {
    displayName: "Size in Bytes",
    jsonKeys: ["data", "details", "fileSizeInBytes"],
  },
  { displayName: "Short Description", jsonKeys: ["shortDescription"] },
  { displayName: "Data Type", jsonKeys: ["dataType"] },
  { displayName: "Tenant Name", jsonKeys: ["data", "details", "tenantName"] },
  { displayName: "Time Created", jsonKeys: ["data", "details", "timeCreated"] },
  {
    displayName: "Time Modified",
    jsonKeys: ["data", "details", "timeModified"],
  },
];

async function getBundleData(
  bundleId: string,
  parameter: any
): Promise<BundleDataPagedList> {
  // Generate axios parameter
  const BundleParamCreator = BundleDataApiAxiosParamCreator();
  const getBundlesParam = await BundleParamCreator.getBundleData(bundleId);

  getBundlesParam.url += `?`;
  for (const element in parameter) {
    getBundlesParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getBundlesParam);
  return axiosData.data;
}

function BundleDataPage() {
  const [bundleDataResponse, setBundleDataResponse] =
    useState<BundleDataPagedList | null>();

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
  const { bundleId, dataId } = useParams();

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
      if (bundleId) {
        try {
          const data = await getBundleData(bundleId, apiParameter);
          if (cancel) return;

          setBundleDataResponse(data);
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
  }, [dataId, setDialogInfo, bundleId, apiParameter]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Bundle Data</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Bundle Id: {bundleId}</Typography>
      </Grid>
      {!bundleDataResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={bundleDataResponse.items}
              columnMapping={COLUMN_MAPPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={bundleDataResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default BundleDataPage;
