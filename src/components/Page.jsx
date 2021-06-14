import { withStyles } from "../theme";
import Section from "./Section";

const styles = () => ({
    root: {
        padding: "2em 0",
    },
});

const Page = (props) => {
    const { classes } = props;
    return (
        <Section id="page" variant="front" style={classes.root}>
            <p>Here the content</p>
        </Section>
    );
};

export default withStyles(styles)(Page);
