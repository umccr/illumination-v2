import React, { useState } from "react";

// MUI Components
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

// React Router DOM
import { Link as RouterLink } from "react-router-dom";

// Custom Component/function
import { reformatString } from "../../utils/Utils";

export interface IPaginationProps {
  nextPageToken?: string;
  currentPageToken?: string;
  totalItem: number;
  remaingRecord?: number;
}

export interface linkToProps {
  formatString: string;
  formatValue: string[][];
}

export interface IColumnMapping {
  displayName: string;
  jsonKeys: string | string[];
  linkTo?: linkToProps;
}

interface ITableProps {
  items: any[];
  columnMapping: IColumnMapping[];
  paginationProps?: IPaginationProps;
}

function CustomTable(props: ITableProps) {
  const { items, columnMapping } = props;

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <CustomTableHead columnMapping={columnMapping} />
          <CustomTableBody listItem={items} columnMapping={columnMapping} />
        </Table>
      </TableContainer>
      <TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
  );
}

// Custom styling
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: grey[300],
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    align: "center",
    fontSize: 14,
  },
}));

// Custom Table Head
interface ICustomTableHeadProps {
  columnMapping: IColumnMapping[];
}
function CustomTableHead(props: ICustomTableHeadProps) {
  const { columnMapping } = props;

  return (
    <TableHead>
      <TableRow>
        {columnMapping.map((columnObject: IColumnMapping, index: number) => (
          <StyledTableCell key={index}>
            {columnObject.displayName}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Custom Table Body
interface ICustomTableBodyProps {
  listItem: any[];
  columnMapping: IColumnMapping[];
}

function findArrayValuesFromJsonKeys(item: any, jsonKeysList: string[][]) {
  const results: string[] = [];

  for (const keys of jsonKeysList) {
    results.push(findValueFromKeyList(item, keys));
  }

  return results;
}

function CustomTableBody(props: ICustomTableBodyProps) {
  const { listItem, columnMapping } = props;

  return (
    <TableBody>
      {listItem.map((item: any, index: number) => (
        <StyledTableRow key={index}>
          {columnMapping.map((displayObj: IColumnMapping, objIndex: number) => (
            <StyledTableCell align="left" key={objIndex}>
              {displayObj.linkTo ? (
                <RouterLink
                  style={{ color: "black" }}
                  to={reformatString(
                    displayObj.linkTo.formatString,
                    findArrayValuesFromJsonKeys(
                      item,
                      displayObj.linkTo.formatValue
                    )
                  )}
                >
                  {typeof displayObj.jsonKeys == "string"
                    ? displayObj.jsonKeys
                    : findValueFromKeyList(item, displayObj.jsonKeys)}
                </RouterLink>
              ) : (
                <>
                  {typeof displayObj.jsonKeys == "string"
                    ? displayObj.jsonKeys
                    : findValueFromKeyList(item, displayObj.jsonKeys)}
                </>
              )}
            </StyledTableCell>
          ))}
        </StyledTableRow>
      ))}
    </TableBody>
  );
}

function findValueFromKeyList(resObj: any, keyList: string[]): string {
  let name_of_object = resObj;
  for (const key of keyList) {
    name_of_object = name_of_object[key];
  }
  return String(name_of_object);
}

export default CustomTable;
