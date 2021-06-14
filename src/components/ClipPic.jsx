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
    return <div style={classes.root}>IMG</div>;
};

export default withStyles(styles)(ClipPic);
