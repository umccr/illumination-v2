import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import {
  StorageBundleList,
  StorageBundleApiAxiosParamCreator,
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
  { displayName: "Bundle Name", jsonKeys: ["bundleName"] },
  { displayName: "Entitlement Name", jsonKeys: ["entitlementName"] },
  { displayName: "Id", jsonKeys: ["id"] },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getStorageBundleData(
  parameter: any
): Promise<StorageBundleList> {
  // Generate axios parameter
  const StorageBundleParamCreator = StorageBundleApiAxiosParamCreator();
  const getStorageBundleParam =
    await StorageBundleParamCreator.getStorageBundles();

  getStorageBundleParam.url += `?`;
  for (const element in parameter) {
    getStorageBundleParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getStorageBundleParam);
  return axiosData.data;
}

function StorageBundlePage() {
  const [storageBundleListResponse, setStorageBundleListResponse] =
    useState<StorageBundleList | null>();
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
        const data = await getStorageBundleData(apiParameter);
        if (cancel) return;

        setStorageBundleListResponse(data);
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
        <Typography variant="h4">Storage Bundles</Typography>
      </Grid>

      {!storageBundleListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={storageBundleListResponse.items}
              columnMapping={COLUMN_MAPPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={storageBundleListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default StorageBundlePage;
