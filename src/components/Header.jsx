import { withStyles } from "../theme";
import Section from "./Section";

const styles = () => ({
    root: {
        padding: "4em 0",
    },
    name: {
        textTransform: "uppercase",
    },
});

const Header = (props) => {
    const { classes } = props;

    return (
        <Section id="header" style={classes.root}>
            <div style={classes.name}>Jonathan Adami</div>
        </Section>
    );
};

export default withStyles(styles)(Header);
