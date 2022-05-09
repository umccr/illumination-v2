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
import TableSortLabel from "@mui/material/TableSortLabel";

// React Router DOM
import { Link as RouterLink } from "react-router-dom";

// Custom Component/function
import { reformatString } from "../../utils/Utils";

export interface IPaginationProps {
  totalItem: number;
  rowsPerPage: number;
  currentPageNumber: number;
}

export const paginationPropsInit: IPaginationProps = {
  totalItem: 0,
  rowsPerPage: 10,
  currentPageNumber: 0,
};

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
  handlePaginationPropsChange?: Function;
}

/**
 * Custom Main Table
 */
export default function CustomTable(props: ITableProps) {
  const { items, columnMapping, paginationProps, handlePaginationPropsChange } =
    props;

  // Table Ordering
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string | string[] | undefined>();
  const handleRequestSort = (property: string | string[]) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <CustomTableHead
            columnMapping={columnMapping}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <CustomTableBody
            listItem={items}
            columnMapping={columnMapping}
            order={order}
            orderBy={orderBy}
          />
        </Table>
      </TableContainer>
      {paginationProps && handlePaginationPropsChange ? (
        CustomPaginationTable(paginationProps, handlePaginationPropsChange)
      ) : (
        <></>
      )}
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

type Order = "asc" | "desc";

/**
 * Table Body
 */

interface ICustomTableHeadProps {
  columnMapping: IColumnMapping[];
  onRequestSort: (property: string | string[]) => void;
  order: Order;
  orderBy?: string | string[];
}
function CustomTableHead(props: ICustomTableHeadProps) {
  const { columnMapping, order, orderBy, onRequestSort } = props;

  function updateSortItem(displayName: string | string[]) {
    onRequestSort(displayName);
  }
  return (
    <TableHead>
      <TableRow>
        {columnMapping.map((columnObject: IColumnMapping, index: number) => (
          <StyledTableCell key={index}>
            <TableSortLabel
              active={orderBy === columnObject.jsonKeys}
              direction={orderBy === columnObject.jsonKeys ? order : "asc"}
              onClick={() => updateSortItem(columnObject.jsonKeys)}
            >
              {columnObject.displayName}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/**
 * Table Body
 */
interface ICustomTableBodyProps {
  listItem: any[];
  columnMapping: IColumnMapping[];
  order: Order;
  orderBy?: string | string[];
}

function findArrayValuesFromJsonKeys(item: any, jsonKeysList: string[][]) {
  const results: string[] = [];

  for (const keys of jsonKeysList) {
    results.push(findValueFromKeyList(item, keys));
  }

  return results;
}

function CustomTableBody(props: ICustomTableBodyProps) {
  const { listItem, columnMapping, order, orderBy } = props;

  return (
    <TableBody>
      {sortTableValues(listItem, order, orderBy).map(
        (item: any, index: number) => (
          <StyledTableRow key={index}>
            {columnMapping.map(
              (displayObj: IColumnMapping, objIndex: number) => (
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
              )
            )}
          </StyledTableRow>
        )
      )}
    </TableBody>
  );
}

/**
 * Pagination Table
 */

function CustomPaginationTable(
  props: IPaginationProps,
  handlePaginationPropsChange: Function
) {
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handlePaginationPropsChange({
      rowsPerPage: +event.target.value,
      currentPageNumber: 0,
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    handlePaginationPropsChange({ currentPageNumber: newPage });
  };

  return (
    <TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={props.totalItem}
        rowsPerPage={props.rowsPerPage}
        page={props.currentPageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

/**
 * Helper Function
 */

function findValueFromJsonKeys(item: any, jsonKeys: string | string[]): string {
  if (typeof jsonKeys == "string") {
    return jsonKeys;
  }
  return findValueFromKeyList(item, jsonKeys);
}

function findValueFromKeyList(resObj: any, keyList: string[]): string {
  let name_of_object = resObj;
  for (const key of keyList) {
    name_of_object = name_of_object[key];
  }
  return String(name_of_object);
}

function sortTableValues(
  dataList: any[],
  order: Order,
  orderBy?: string | string[]
): any[] {
  if (!orderBy) {
    return dataList;
  } else {
    return dataList.sort((a, b) => {
      let result = 0;
      if (findValueFromJsonKeys(b, orderBy) < findValueFromJsonKeys(a, orderBy))
        result = 1;
      if (findValueFromJsonKeys(b, orderBy) > findValueFromJsonKeys(a, orderBy))
        result = -1;

      if (order === "desc") {
        result = result * -1;
      }
      return result;
    });
  }
}

export function getTotalItemCountFromRes(dataRes: any): number {
  const totalRecord: number = dataRes.totalItemCount
    ? dataRes.totalItemCount
    : dataRes.items.length;

  return totalRecord;
}
