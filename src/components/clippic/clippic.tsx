import { StyleFn, theme } from "@/theme";
import { FC } from "react";

const styles: StyleFn = () => ({
    root: {
        width: "150px",
        height: "150px",
        borderRadius: "75px",
        backgroundColor: "red",
        position: "absolute",
        top: "50%",
    },
});
export const ClipPic: FC<object> = () => {
    const classes = styles(theme);
    return <img style={classes.root} src="https://avatars.githubusercontent.com/u/5304?v=4" />;
};
