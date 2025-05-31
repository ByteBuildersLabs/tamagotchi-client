import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./global.css";

// PWA Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js", { type: "module" })
            .then((registration) => {
                console.log("ServiceWorker registration successful:", registration);
            })
            .catch((error) => {
                console.log("ServiceWorker registration failed:", error);
            });
    });
}

function main() {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}

main();