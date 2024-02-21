import React from "react";
import { theme } from "./theme";

import { Footer, Header, Page } from "./components";

const App = () => {
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

export default App;
