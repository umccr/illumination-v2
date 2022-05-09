import React, { useEffect, useState } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import { Connector, ConnectorApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import { useDialogContext } from "../../container/app/DialogContext";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import ChipArray, { IButtonProps } from "../../components/chipArray/ChipArray";

const buttonProps: IButtonProps[] = [
  { name: "Download Rule", route: "downloadRules" },
  { name: "Upload Rule", route: "uploadRules" },
]

async function getConnectorData(connectorId: string): Promise<Connector> {
  // Generate axios parameter
  const ConnectorParamCreator = ConnectorApiAxiosParamCreator();
  const getConnectorsParam = await ConnectorParamCreator.getConnector(connectorId);

  // Calling axios
  const axiosData = await RunAxios(getConnectorsParam);
  return axiosData.data;
}

function ConnectorPage() {
  const { connectorId } = useParams();

  const { setDialogInfo } = useDialogContext();
  const [connectorResponse, setConnectorResponse] = useState<Connector | null>();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (connectorId) {
          const data = await getConnectorData(connectorId);
          if (cancel) return;
          setConnectorResponse(data);
        }
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
  }, [connectorId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Connector Id: {connectorId}</Typography>
      </Grid>
      <ChipArray data={buttonProps} />
      {!connectorResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={connectorResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ConnectorPage;
