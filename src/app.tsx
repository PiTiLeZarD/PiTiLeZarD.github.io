import { createRoot } from "react-dom/client";

import { Footer } from "@cmp/footer";
import { Header } from "@cmp/header";
import { Page } from "@cmp/page";

import { theme } from "./theme";

export const App = () => {
    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand" />

            <style type="text/css">{`
                body, html {
                    margin: 0;
                    padding: 0;
                    background-color: ${theme.colours.primary};
                }
                * {
                    font-family: "Quicksand", Sans-serif;
                }
            `}</style>
            <Header />
            <Page />
            <Footer />
        </>
    );
};

const root = document.getElementById("root");
createRoot(root!).render(<App />);
