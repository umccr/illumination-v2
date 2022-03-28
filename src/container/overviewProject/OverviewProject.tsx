import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { ProjectPagedList } from "../../openapi/api";

// SOME CONSTANT VALUE
import { PROJECT_DATA_SAMPLE } from "../../utils/constant";

interface IOverviewProjectProps {
  projectData: ProjectPagedList;
}

function OverviewProject(projectOverviewProps: IOverviewProjectProps) {
  console.log(projectOverviewProps);

  const [projectData, setProjectData] =
    useState<ProjectPagedList>(PROJECT_DATA_SAMPLE);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, width: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Projects</TableCell>
            <TableCell>Data</TableCell>
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
              <TableCell>
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
