import React from "react";
import { TableContainer, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import JSONPretty from "react-json-pretty";

interface IJSONProps {
  data: any;
}

function JSONContainer(props: IJSONProps) {
  const { data } = props;

  return (
    <TableContainer sx={{ position: "relative" }}>
      <Button
        onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
        sx={{ position: "absolute", right: 0, top: "0.5rem" }}
      >
        <ContentCopyIcon />
      </Button>
      <JSONPretty
        data={data}
        style={{ margin: "-1em 0 2em" }}
        theme={{
          main: "line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;",
          string: "color:#fd971f;",
          value: "color:#a6e22e;",
          boolean: "color:#ac81fe;",
        }}
      />
    </TableContainer>
  );
}

export default JSONContainer;
