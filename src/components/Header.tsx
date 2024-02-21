import React from "react";
import { withStyles } from "../theme";
import ClipPic from "./ClipPic";
import Section from "./Section";

const styles = () => ({
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

const Header = (props) => {
    const { classes } = props;

    return (
        <Section id="header" style={classes.root}>
            <ClipPic />
            <h1 style={classes.name}>Jonathan Adami</h1>
        </Section>
    );
};

export default withStyles(styles)(Header);
