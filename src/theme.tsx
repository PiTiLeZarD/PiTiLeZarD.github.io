import { CSSProperties } from "react";

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

export type StyleFn = (props: typeof theme) => Record<string, CSSProperties>;
