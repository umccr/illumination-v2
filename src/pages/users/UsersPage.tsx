import React, { useState, useEffect } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { UserList, UserApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
  { displayName: "Email", jsonKeys: ["email"] },
  {
    displayName: "ID",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "User Name", jsonKeys: ["username"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
];

async function getUsersData(): Promise<UserList> {
  // Generate axios parameter
  const usersParamCreator = UserApiAxiosParamCreator();
  const getUsersParam = await usersParamCreator.getUsers();

  // Calling axios
  const axiosData = await RunAxios(getUsersParam);
  return axiosData.data;
}

function UsersPage() {
  const [usersListResponse, setUsersListResponse] = useState<UserList | null>();
  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getUsersData();
        if (cancel) return;

        setUsersListResponse(data);
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
        <Typography variant="h4">Available Users</Typography>
      </Grid>

      {!usersListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={usersListResponse.items}
              columnMapping={COLUMN_MAPPPING}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={usersListResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default UsersPage;
