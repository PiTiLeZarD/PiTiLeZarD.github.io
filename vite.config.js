import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@cmp": resolve(__dirname, "./src/components"),
        },
    },
    plugins: [react()],
    base: "",
    server: {
        port: 19200,
        strictPort: true,
    },
    build: {
        sourcemap: false,
        chunkSizeWarningLimit: 2048,
        rollupOptions: {
            onLog: (level, log, handler) => {
                if (log.cause && log.cause.message === `Can't resolve original location of error.`) {
                    return;
                }
                handler(level, log);
            },
        },
    },
});
