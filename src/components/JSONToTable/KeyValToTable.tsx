import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
// Custom Component
import JSONToTable from "./JSONToTable";

interface IKeyValToTableProps {
  KeyValJson: any;
}

function KeyValToTable(props: IKeyValToTableProps) {
  const { KeyValJson } = props;

  const jsonKeysArray = Object.keys(KeyValJson);

  return (
    <Table>
      <TableBody>
        {jsonKeysArray.map((jsonKey) => (
          <TableRow key={jsonKey} className="row-style">
            <TableCell
              sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
              variant="head"
            >
              {jsonKey}
            </TableCell>
            <TableCell sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
              <JSONToTable JSONData={KeyValJson[jsonKey]} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default KeyValToTable;
