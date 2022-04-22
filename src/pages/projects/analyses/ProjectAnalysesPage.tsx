import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import {
  ProjectAnalysisApiAxiosParamCreator,
  AnalysisPagedList,
  RunAxios,
} from "icats";

// Custom components
import TokenPagination, {
  ITokenPaginationData,
  tokenPaginationInit,
} from "../../../container/tokenPagination/TokenPagination";
import JSONContainer from "../../../components/JSONContainer/JSONContainer";
import { useDialogContext } from "../../../container/app/DialogContext";
import CustomTable, { IColumnMapping } from "../../../container/table/Table";


const COLUMN_MAPPPING: IColumnMapping[] = [
  {
    displayName: "ID",
    jsonKeys: ["id"],
    linkTo: { formatString: "{0}", formatValue: [["id"]] },
  },
  { displayName: "Time Created", jsonKeys: ["timeCreated"] },
  { displayName: "Time Modified", jsonKeys: ["timeModified"] },
  { displayName: "Owner Id", jsonKeys: ["ownerId"] },
  { displayName: "Tenant Id", jsonKeys: ["tenantId"] },
  { displayName: "Tenant Name", jsonKeys: ["tenantName"] },
  { displayName: "Reference", jsonKeys: ["reference"] },
  { displayName: "User Reference", jsonKeys: ["userReference"] },
  { displayName: "Pipeline Id", jsonKeys: ["pipeline", "id"] },
];

async function getProjectAnalysesData(
  projectId: string,
  parameter: any
): Promise<AnalysisPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectAnalysisApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getAnalyses(projectId);

  getProjectsParam.url += `?`;
  for (const element in parameter) {
    getProjectsParam.url += `${element}=${parameter[element]}`;
  }

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

function convertResponseToPaginationProps(
  projectRes: AnalysisPagedList,
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

function ProjectAnalysesPage() {
  const [projectAnalysesResponse, setProjectAnalysesResponse] =
    useState<AnalysisPagedList | null>();

  const [tokenPaginationData, setTokenPaginationData] =
    useState<ITokenPaginationData>(tokenPaginationInit);

  const [apiParameter, setApiParameter] = useState({ pageToken: "" });
  function handleApiParameterChange(parameterChange: { pageToken: string }) {
    setApiParameter((prev) => ({ ...prev, ...parameterChange }));
  }

  const { setDialogInfo } = useDialogContext();
  const { projectId } = useParams();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      if (projectId) {
        try {
          const data = await getProjectAnalysesData(projectId, apiParameter);
          if (cancel) return;

          setProjectAnalysesResponse(data);
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

    fetchData();

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
        <Typography variant="h4">Projects Anayleses: {projectId}</Typography>
      </Grid>

      {!projectAnalysesResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={projectAnalysesResponse.items}
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
            <JSONContainer data={projectAnalysesResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectAnalysesPage;
