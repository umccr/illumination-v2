import React, { useState, useEffect } from "react";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// icats component
import { User, UserApiAxiosParamCreator, RunAxios } from "icats";

// Custom components
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";

async function getUserData(userId: string): Promise<User> {
  // Generate axios parameter
  const userParamCreator = UserApiAxiosParamCreator();
  const getUserParam = await userParamCreator.getUser(userId);

  // Calling axios
  const axiosData = await RunAxios(getUserParam);
  return axiosData.data;
}

function UserPage() {
  const { userId } = useParams();

  const [userResponse, setUserResponse] = useState<User | null>();

  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;
    async function fetchData() {
      try {
        if (userId) {
          const data = await getUserData(userId);
          if (cancel) return;
          setUserResponse(data);
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
  }, [userId, setDialogInfo]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">
          {userResponse? `${userResponse.firstname} ${userResponse?.lastname}`: `User`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">User Id: {userId}</Typography>
      </Grid>

      {!userResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <JSONContainer data={userResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default UserPage;
