import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default {
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@cmp": resolve(__dirname, "./src/components"),
        },
    },
    plugins: [react()],
    base: "",
};
