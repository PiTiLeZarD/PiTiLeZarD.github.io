import { FC } from "react";

import { StyleFn, theme } from "@/theme";
import { ClipPic } from "@cmp/clippic";
import { Section } from "@cmp/section";

const styles: StyleFn = () => ({
    root: {
        padding: "2em 0",
    },
    name: {
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "30px",
    },
});

export const Header: FC<object> = () => {
    const classes = styles(theme);

    return (
        <Section id="header" style={classes.root}>
            <ClipPic />
            <h1 style={classes.name}>Jonathan Adami</h1>
        </Section>
    );
};
