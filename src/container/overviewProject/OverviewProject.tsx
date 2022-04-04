import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { ProjectApiAxiosParamCreator, ProjectPagedList, RunAxios } from "icats";

import { PROJECT_DATA_SAMPLE } from "../../utils/constant";

async function getProjectData(): Promise<ProjectPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectApiAxiosParamCreator();
  const getProjectsParamter = await ProjectParamCreator.getProjects();

  // Calling axios
  const axiosData = await RunAxios(getProjectsParamter);
  return axiosData.data;
}


function OverviewProject() {
  const [projectData, setProjectData] =
    useState<ProjectPagedList>(PROJECT_DATA_SAMPLE);

  useEffect(() => {
    async function fetchData() {
      const data = await getProjectData();
      setProjectData(data);
      console.log(data);
    }
    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, width: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Projects</TableCell>
            <TableCell sx={{ borderLeft: "1px solid rgba(224, 224, 224, 1)" }}>
              Data
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projectData.items.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell
                style={{ borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
              >
                <Link to={row.id} style={{ textDecoration: "none" }}>
                  DATA
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OverviewProject;
