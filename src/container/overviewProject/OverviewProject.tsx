import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import { ProjectApiAxiosParamCreator, ProjectPagedList, RunAxios } from "icats";

async function getProjectData(): Promise<ProjectPagedList> {
  // Generate axios parameter
  const ProjectParamCreator = ProjectApiAxiosParamCreator();
  const getProjectsParamter = await ProjectParamCreator.getProjects();

  // Calling axios
  const axiosData = await RunAxios(getProjectsParamter);
  return axiosData.data;
}

function OverviewProject() {
  const [projectData, setProjectData] = useState<ProjectPagedList | null>();

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      const data = await getProjectData();

      if (cancel) return;
      setProjectData(data);
    }

    fetchData();

    return () => {
      cancel = true;
    };
  }, []);

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{ display: "flex", justifyContent: "center"}}
    >
      {!projectData ? (
        <div style={{ minHeight: "75px" }}>
          <CircularProgress sx={{ marginTop: "1rem" }} />
        </div>
      ) : (
        <Table sx={{ minWidth: 650, width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Projects</TableCell>
              <TableCell
                sx={{ borderLeft: "1px solid rgba(224, 224, 224, 1)" }}
              >
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
      )}
    </TableContainer>
  );
}

export default OverviewProject;
