import { StyleFn, theme } from "@/theme";
import { Section } from "@cmp/section";

const styles: StyleFn = () => ({
    root: {
        padding: "5em 0 2em 0",
    },
});

export const Page = () => {
    const classes = styles(theme);
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
