import React from "react";

import { withStyles } from "../theme";
const styles = () => ({
    root: {
        width: "150px",
        height: "150px",
        borderRadius: "75px",
        backgroundColor: "red",
        position: "absolute",
        top: "50%",
    },
});
const ClipPic = (props) => {
    const { classes } = props;
    return <img style={classes.root} src="https://avatars.githubusercontent.com/u/5304?v=4" />;
};

export default withStyles(styles)(ClipPic);
