import React, { useState, useEffect } from "react";
import { grey } from "@mui/material/colors";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { ProjectPagedList, ProjectApiAxiosParamCreator, RunAxios } from "icats";
import JSONContainer  from "../../components/JSONContainer/JSONContainer";
import { PROJECT_DATA_SAMPLE } from "../../utils/constant";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: grey[300],
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

interface ITableConstant {
  displayName: string;
  jsonKey: string | string[];
}
const COLUMN_CONSTANT: ITableConstant[] = [
  { displayName: "Name", jsonKey: ["name"] },
  { displayName: "Data", jsonKey: "DATA" },
  { displayName: "ID", jsonKey: ["id"] },
  { displayName: "OwnerId", jsonKey: ["ownerId"] },
  { displayName: "TenantId", jsonKey: ["tenantId"] },
  { displayName: "TenantName", jsonKey: ["tenantName"] },
  { displayName: "Active", jsonKey: ["active"] },
  { displayName: "Information", jsonKey: ["information"] },
  { displayName: "TimeCreated", jsonKey: ["timeCreated"] },
  { displayName: "TimeModified", jsonKey: ["timeModified"] },
  { displayName: "BillingMode", jsonKey: ["billingMode"] },
  { displayName: "DataSharingEnabled", jsonKey: ["dataSharingEnabled"] },
  { displayName: "StorageBundleId", jsonKey: ["storageBundle", "id"] },
  {
    displayName: "StorageBundleName",
    jsonKey: ["storageBundle", "bundleName"],
  },
];

function CustomTableHead() {
  return (
    <TableHead>
      <TableRow>
        {COLUMN_CONSTANT.map((columnObject: ITableConstant, index: number) => (
          <StyledTableCell key={index}>
            {columnObject.displayName}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface IPropsCustomTableBody {
  listItem: any[];
}

function findValueFromKeyList(resObj: any, keyList: string[]): string {
  let name_of_object = resObj;
  for (const key of keyList) {
    name_of_object = name_of_object[key];
  }
  return String(name_of_object);
}

function CustomTableBody(props: IPropsCustomTableBody) {
  const { listItem } = props;

  return (
    <TableBody>
      {listItem.map((item: any, index: number) => (
        <StyledTableRow key={index}>
          {COLUMN_CONSTANT.map(
            (displayObj: ITableConstant, objIndex: number) => (
              <StyledTableCell align="right" key={objIndex}>
                {typeof displayObj.jsonKey == "string"
                  ? displayObj.jsonKey
                  : findValueFromKeyList(item, displayObj.jsonKey)}
              </StyledTableCell>
            )
          )}
        </StyledTableRow>
      ))}
    </TableBody>
  );
}

async function getProjectData(): Promise<ProjectPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectApiAxiosParamCreator();
  const getProjectsParamter = await ProjectParamCreator.getProjects();

  // Calling axios
  const axiosData = await RunAxios(getProjectsParamter);
  return axiosData.data;
}

function ProjectPage() {
  const [projectListResponse, setProjectListResponse] =
    useState<ProjectPagedList | null>();

  useEffect(() => {
    async function fetchData() {
      const data = await getProjectData();
      setProjectListResponse(data);
    }
    fetchData();

    // setProjectListResponse(PROJECT_DATA_SAMPLE);
  }, []);
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">Available Projects</Typography>
      </Grid>

      {!projectListResponse ? (
        "Loading ... "
      ) : (
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <CustomTableHead />
              <CustomTableBody listItem={projectListResponse.items} />
            </Table>
          </TableContainer>

          <JSONContainer data={projectListResponse.items} />
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectPage;
