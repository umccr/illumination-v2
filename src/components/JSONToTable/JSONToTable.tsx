import { Typography } from "@mui/material";
import ArrayToTable from "./ArrayToTable";
import KeyValToTable from "./KeyValToTable";

interface IJSONToTableProps {
  JSONData: any;
}

function JSONToTable(props: IJSONToTableProps) {
  const { JSONData } = props;

  if (Array.isArray(JSONData)) {
    return <ArrayToTable ArrayData={JSONData} />;
  }

  if (typeof JSONData === "object") {
    return <KeyValToTable KeyValJson={JSONData} />;
  }
  return (
    <Typography>
      {String(JSONData) === "undefined" ? "-" : String(JSONData)}
    </Typography>
  );
}

export default JSONToTable;
