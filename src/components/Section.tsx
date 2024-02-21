import React from "react";
import { withStyles } from "../theme";

const styles = ({ colours, sizes }) => ({
    wrapper: {
        width: sizes.page,
        margin: "auto",
        position: "relative",
    },
    back: {
        backgroundColor: colours.primary,
    },
    front: {
        backgroundColor: colours.background,
    },
});

const Section = (props) => {
    const { id, variant, classes, children, ...otherProps } = props;
    return (
        <section id={id} style={classes[variant]}>
            <div style={classes.wrapper}>
                <div {...otherProps}>{children}</div>
            </div>
        </section>
    );
};

Section.defaultProps = {
    variant: "back",
};

export default withStyles(styles)(Section);
