import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { BundlePagedList, BundleApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../container/table/Table";

const COLUMN_MAPPING: IColumnMapping[] = [
  {
    displayName: "ID",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Name", jsonKeys: ["name"] },
  { displayName: "Short Description", jsonKeys: ["shortDescription"] },
  { displayName: "Status", jsonKeys: ["status"] },
  { displayName: "Categories", jsonKeys: ["categories"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getBundlesData(): Promise<BundlePagedList> {
  // Generate axios parameter
  const BundlesParamCreator = BundleApiAxiosParamCreator();
  const getBundlesParam = await BundlesParamCreator.getBundles();

  // Calling axios
  const axiosData = await RunAxios(getBundlesParam);
  return axiosData.data;
}

function BundlesPage() {
  const [projectListResponse, setBundlesListResponse] =
    useState<BundlePagedList | null>();

  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getBundlesData();
        if (cancel) return;

        setBundlesListResponse(data);
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
  }, [setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Available Bundles</Typography>
      </Grid>

      {!projectListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectListResponse.items}
              columnMapping={COLUMN_MAPPING}
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

export default BundlesPage;
