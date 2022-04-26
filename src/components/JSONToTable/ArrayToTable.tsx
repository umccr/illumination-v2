import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import JSONTabe from "./JSONToTable";

interface IArrayToTableProps {
  ArrayData: any;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function ArrayToTable(props: IArrayToTableProps) {
  const { ArrayData } = props;

  const keysHeader = getKeys(ArrayData);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {keysHeader.map((header) => (
              <StyledTableCell
                align="center"
                sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                key={header}
              >
                {header}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {ArrayData.map((row: any, index: number) => (
            <StyledTableRow key={index}>
              {keysHeader.map((header) => (
                <StyledTableCell
                  align="center"
                  sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                  key={header}
                >
                  <JSONTabe JSONData={row[header]}></JSONTabe>
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ArrayToTable;

function getKeys(ArrayData: any[]): string[] {
  let keyStringArray: string[] = [];

  for (const item of ArrayData) {
    keyStringArray = keyStringArray.concat(Object.keys(item));
  }

  return Array.from(new Set<string>(keyStringArray));
}
