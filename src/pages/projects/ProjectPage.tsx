import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { ProjectPagedList, ProjectApiAxiosParamCreator, RunAxios } from "icats";
import TokenPagination, {
  ITokenPaginationData,
  tokenPaginationInit,
} from "../../container/tokenPagination/TokenPagination";
import JSONContainer from "../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../container/app/DialogContext";
import { PROJECT_DATA_SAMPLE } from "../../utils/Constant";
import CustomTable, { IColumnMapping } from "../../container/table/Table";

const COLUMN_MAPPPING: IColumnMapping[] = [
  { displayName: "Name", jsonKeys: ["name"] },
  { displayName: "Data", jsonKeys: "DATA" },
  { displayName: "ID", jsonKeys: ["id"] },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Active", jsonKeys: ["active"] },
  { displayName: "Information", jsonKeys: ["information"] },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
  { displayName: "Billing Mode", jsonKeys: ["billingMode"] },
  { displayName: "DataSharing Enabled", jsonKeys: ["dataSharingEnabled"] },
  { displayName: "StorageBundle Id", jsonKeys: ["storageBundle", "id"] },
  {
    displayName: "Storage Bundle Name",
    jsonKeys: ["storageBundle", "bundleName"],
  },
];

async function getProjectData(parameter: any): Promise<ProjectPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectApiAxiosParamCreator();
  const getProjectsParamter = await ProjectParamCreator.getProjects();

  getProjectsParamter.url += `?`;
  for (const element in parameter) {
    getProjectsParamter.url += `${element}=${parameter[element]}`;
  }

  // Calling axios
  const axiosData = await RunAxios(getProjectsParamter);
  return axiosData.data;
}

function convertResponseToPaginationProps(
  projectRes: ProjectPagedList,
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

function ProjectPage() {
  const [projectListResponse, setProjectListResponse] =
    useState<ProjectPagedList | null>();

  const [tokenPaginationData, setTokenPaginationData] =
    useState<ITokenPaginationData>(tokenPaginationInit);

  const [apiParameter, setApiParameter] = useState({ pageToken: "" });
  function handleApiParameterChange(parameterChange: { pageToken: string }) {
    setApiParameter((prev) => ({ ...prev, ...parameterChange }));
  }

  const { setDialogInfo } = useDialogContext();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        const data = await getProjectData(apiParameter);
        setProjectListResponse(data);
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

      if (cancel) return;
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, [apiParameter]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Available Projects</Typography>
      </Grid>

      {!projectListResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectListResponse.items}
              columnMapping={COLUMN_MAPPPING}
            />
          </Grid>

          <Grid item xs={12}>
            <TokenPagination
              data={tokenPaginationData}
              handleApiParameterChange={handleApiParameterChange}
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

export default ProjectPage;
