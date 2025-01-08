import { CSSProperties, FC, PropsWithChildren } from "react";

import { StyleFn, theme } from "@/theme";

const styles: StyleFn = ({ colours, sizes }) => ({
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

export type SectionProps = {
    id: string;
    variant?: "back" | "front";
    style?: CSSProperties;
};

export const Section: FC<PropsWithChildren<SectionProps>> = ({ id, variant = "back", children, ...otherProps }) => {
    const classes = styles(theme);
    return (
        <section id={id} style={classes[variant]}>
            <div style={classes.wrapper}>
                <div {...otherProps}>{children}</div>
            </div>
        </section>
    );
};
