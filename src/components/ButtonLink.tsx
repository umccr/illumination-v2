import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";

export interface ButtonLinkProps extends ButtonProps {
  to: string;
}

const ButtonLink = (props: ButtonLinkProps) => (
  <Button
    {...props}
    LinkComponent={RouterLink}
  >
    {props.children}
  </Button>
);

export default ButtonLink;
