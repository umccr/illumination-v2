import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useSearchParams, useNavigate } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { SamplePagedList, SampleApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import CustomTable, {
  IColumnMapping,
  IPaginationProps,
  paginationPropsInit,
  getTotalItemCountFromRes,
} from "../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  { displayName: "ID", jsonKeys: ["id"] },
  { displayName: "Name", jsonKeys: ["name"] },
  { displayName: "Status", jsonKeys: ["status"] },
  { displayName: "Metadata Valid", jsonKeys: ["metadataValid"] },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getSamplesData(
  region: string,
  parameter: any
): Promise<SamplePagedList> {
  // Generate axios parameter
  const SamplesParamCreator = SampleApiAxiosParamCreator();
  const getSamplesParam = await SamplesParamCreator.getSamples(region);

  getSamplesParam.url += `&`;
  for (const element in parameter) {
    getSamplesParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getSamplesParam);
  return axiosData.data;
}

function SamplesPage() {
  // Take region Id for input
  const [searchParams] = useSearchParams();
  const region = searchParams.get("region");
  const navigate = useNavigate();

  if (!region) {
    navigate("../regions", { replace: true });
  }

  const { setDialogInfo } = useDialogContext();
  const [samplesResponse, setSamplesResponse] =
    useState<SamplePagedList | null>();
  const [paginationProps, setPaginationProps] =
    useState<IPaginationProps>(paginationPropsInit);
  function handlePaginationPropsChange(newProps: any) {
    setPaginationProps((prev) => ({ ...prev, ...newProps }));
  }

  const [apiParameter, setApiParameter] = useState({
    pageOffset: 0,
    pageSize: paginationProps.rowsPerPage,
  });

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
        if (region) {
          const data = await getSamplesData(region, apiParameter);
          if (cancel) return;
          setSamplesResponse(data);
          handlePaginationPropsChange({
            totalItem: getTotalItemCountFromRes(data),
          });
        }
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
  }, [region, setDialogInfo, apiParameter]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Region Id: {region}</Typography>
      </Grid>
      {!samplesResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={samplesResponse.items}
              columnMapping={COLUMN_MAPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={samplesResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default SamplesPage;
