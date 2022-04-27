import React, { useEffect, useState } from "react";

// MUI components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// React-Router-Dom components
import { useParams } from "react-router-dom";

// icats component
import {
  ProjectDataTransferApiAxiosParamCreator,
  DataTransfers,
  RunAxios,
} from "icats";

// Custom components
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
  { displayName: "Direction", jsonKeys: ["direction"] },
];

async function getProjectDataTransferData(
  projectId: string,
  parameter: any
): Promise<DataTransfers> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectDataTransferApiAxiosParamCreator();
  const getProjectsParam = await ProjectParamCreator.getDataTransfers(
    projectId
  );

  getProjectsParam.url += `?`;
  for (const element in parameter) {
    getProjectsParam.url += `${element}=${parameter[element]}`;
  }

  // Calling axios
  const axiosData = await RunAxios(getProjectsParam);
  return axiosData.data;
}

function ProjectDataTransferPage() {
  const [projectDataTransferResponse, setProjectDataTransferResponse] =
    useState<DataTransfers | null>();

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
          const data = await getProjectDataTransferData(
            projectId,
            apiParameter
          );
          if (cancel) return;

          setProjectDataTransferResponse(data);
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
        <Typography variant="h4">Projects Data Transfer</Typography>
      </Grid>

      {!projectDataTransferResponse ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          {/* <Grid item xs={12}>
            <CustomTable
              items={projectDataTransferResponse.dataTransfers}
              columnMapping={COLUMN_MAPPPING}
            />
          </Grid> */}

          <Grid item xs={12}>
            <JSONContainer data={projectDataTransferResponse} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectDataTransferPage;
