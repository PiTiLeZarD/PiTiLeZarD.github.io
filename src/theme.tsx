import React from "react";

const colours = {
    background: "#F8FCDA",
    hover: "#E3E9C2",
    secondary: "#F9FBB2",
    primary: "#7C6354",
    default: "#A5ABAF",
};

const sizes = {
    page: "900px",
};

export const theme = { colours, sizes };

export const withStyles =
    (styles) =>
    (Component) =>
    ({ ...props }) => <Component classes={styles(theme)} {...props} />;
