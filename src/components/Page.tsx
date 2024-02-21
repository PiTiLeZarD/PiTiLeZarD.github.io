import React from "react";
import { withStyles } from "../theme";
import Section from "./Section";

const styles = () => ({
    root: {
        padding: "5em 0 2em 0",
    },
});

const Page = (props) => {
    const { classes } = props;
    return (
        <Section id="page" variant="front" style={classes.root}>
            <p>Looking for a project I've made?</p>
            <ul>
                <li>
                    <a href="https://pitilezard.github.io/down-the-log/">DownTheLog</a>
                </li>
                <li>
                    <a href="https://pitilezard.github.io/memup/">Memup</a>
                </li>
            </ul>
        </Section>
    );
};

export default withStyles(styles)(Page);
