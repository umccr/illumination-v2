import React, { useEffect, useState } from "react";
// React-Router-Dom components
import { useParams } from "react-router-dom";

// MUI Component
import { CircularProgress, Grid, Typography } from "@mui/material";

// icats Component
import {
  ProjectDataApiAxiosParamCreator,
  DataPagedList,
  RunAxios,
} from "icats";

// Custom component
import TokenPagination, {
  ITokenPaginationData,
  tokenPaginationInit,
} from "../../../container/tokenPagination/TokenPagination";
import { useDialogContext } from "../../../container/app/DialogContext";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";

async function getProjectDataNonSampleData(
  projectId: string,
  parameter: any
): Promise<DataPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectDataApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getNonSampleProjectData(
    projectId
  );

  getProjectsParam.url += `?`;
  for (const element in parameter) {
    getProjectsParam.url += `${element}=${parameter[element]}`;
  }

  // Calling axios
  const axiosDataNonSampleData = await RunAxios(getProjectsParam);
  return axiosDataNonSampleData.data;
}

function convertResponseToPaginationProps(
  projectRes: DataPagedList,
  prevToken: string
): ITokenPaginationData {
  const totalRecord = projectRes.totalItemCount
    ? projectRes.totalItemCount
    : projectRes.items.length;
  const remainingRecord = projectRes.remainingRecords
    ? projectRes.remainingRecords
    : 0;
  const nextPageToken = projectRes.nextPageToken
    ? projectRes.nextPageToken
    : "";

  return {
    totalRecord: totalRecord,
    remainingRecord: remainingRecord,
    prevPageToken: prevToken,
    nextPageToken: nextPageToken,
  };
}

function ProjectDataNonSampleDataPage() {
  const [
    projectDataNonSampleDataResponse,
    setProjectDataNonSampleDataResponse,
  ] = useState<DataPagedList | null>();

  const { setDialogInfo } = useDialogContext();
  const { projectId } = useParams();

  const [tokenPaginationData, setTokenPaginationData] =
    useState<ITokenPaginationData>(tokenPaginationInit);
  const [apiParameter, setApiParameter] = useState({ pageToken: "" });
  function handleApiParameterChange(parameterChange: { pageToken: string }) {
    setApiParameter((prev) => ({ ...prev, ...parameterChange }));
  }

  useEffect(() => {
    let cancel = false;

    async function fetchDataNonSampleData() {
      if (projectId) {
        try {
          const data = await getProjectDataNonSampleData(
            projectId,
            apiParameter
          );
          if (cancel) return;

          setProjectDataNonSampleDataResponse(data);
          setTokenPaginationData((prev) =>
            convertResponseToPaginationProps(data, prev.nextPageToken)
          );
        } catch (err) {
          setDialogInfo({
            isOpen: true,
            dialogTitle: "Error",
            dialogContent: `Sorry, An error has occured while fetching the API (${err}). Please try again!`,
          });
        }
      }
    }

    fetchDataNonSampleData();

    return () => {
      cancel = true;
    };
  }, [apiParameter, setDialogInfo, projectId]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Project DataNonSampleData</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Project Id: {projectId}</Typography>
      </Grid>
      {!projectDataNonSampleDataResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <TokenPagination
              data={tokenPaginationData}
              handleApiParameterChange={handleApiParameterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <JSONContainer data={projectDataNonSampleDataResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectDataNonSampleDataPage;
