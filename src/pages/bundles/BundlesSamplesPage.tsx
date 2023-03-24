import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  BundleSampleApiAxiosParamCreator,
  BundleSamplePagedList,
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

const COLUMN_MAPPING: IColumnMapping[] = [
  { displayName: "Bundle Id", jsonKeys: ["bundleId"] },
  { displayName: "Sample Value", jsonKeys: ["sample", "value"] },
];

async function getBundleSamples(
  bundleId: string,
  parameter: any
): Promise<BundleSamplePagedList> {
  // Generate axios parameter
  const BundleParamCreator = BundleSampleApiAxiosParamCreator();
  const getBundlesParam = await BundleParamCreator.getBundleSamples(bundleId);

  getBundlesParam.url += `?`;
  for (const element in parameter) {
    getBundlesParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getBundlesParam);
  return axiosData.data;
}

function BundleSamplesPage() {
  const [bundleSamplesResponse, setBundleSamplesResponse] =
    useState<BundleSamplePagedList | null>();

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
  const { bundleId } = useParams();

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
          const data = await getBundleSamples(bundleId, apiParameter);
          if (cancel) return;

          setBundleSamplesResponse(data);
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
  }, [setDialogInfo, bundleId, apiParameter]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Bundle Samples</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Bundle Id: {bundleId}</Typography>
      </Grid>
      {!bundleSamplesResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={bundleSamplesResponse.items}
              columnMapping={COLUMN_MAPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={bundleSamplesResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default BundleSamplesPage;
