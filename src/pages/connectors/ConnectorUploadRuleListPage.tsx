import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { UploadRuleList, ConnectorApiAxiosParamCreator, RunAxios } from "icats";

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
  { displayName: "ID", jsonKeys: ["id"] },
  { displayName: "OS", jsonKeys: ["os"] },
  { displayName: "Local Folder", jsonKeys: ["localFolder"] },
  { displayName: "File Pattern", jsonKeys: ["localFolder"] },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getConnectorUploadRulesData(
  connectorId: string,
  parameter: any
): Promise<UploadRuleList> {
  // Generate axios parameter
  const ConnectorUploadRulesParamCreator = ConnectorApiAxiosParamCreator();
  const getConnectorUploadRulesParam =
    await ConnectorUploadRulesParamCreator.getUploadRules(connectorId);

  getConnectorUploadRulesParam.url += `?`;
  for (const element in parameter) {
    getConnectorUploadRulesParam.url += `${element}=${parameter[element]}&`;
  }

  // Calling axios
  const axiosData = await RunAxios(getConnectorUploadRulesParam);
  return axiosData.data;
}

function ConnectorUploadRulesPage() {
  const [connectorUploadRulesResponse, setUploadRuleListResponse] =
    useState<UploadRuleList | null>();
  const [paginationProps, setPaginationProps] =
    useState<IPaginationProps>(paginationPropsInit);
  function handlePaginationPropsChange(newProps: any) {
    setPaginationProps((prev) => ({ ...prev, ...newProps }));
  }

  const { connectorId } = useParams();

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
        if (connectorId) {
          const data = await getConnectorUploadRulesData(
            connectorId,
            apiParameter
          );
          if (cancel) return;

          setUploadRuleListResponse(data);
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
  }, [connectorId, apiParameter, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Available Connector Upload Rules</Typography>
      </Grid>

      {!connectorUploadRulesResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={connectorUploadRulesResponse.items}
              columnMapping={COLUMN_MAPPING}
              paginationProps={paginationProps}
              handlePaginationPropsChange={handlePaginationPropsChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={connectorUploadRulesResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ConnectorUploadRulesPage;
