import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { posthogInstance } from "./context/PosthogConfig";
import { PostHogProvider } from 'posthog-js/react';
import { MusicProvider } from "./context/MusicContext";
import { MiniKitProvider } from "./context/MiniKitProvider";
import { ChipiProvider } from "./context/ChipiProvider";

// 🧪 Eruda for World App console debugging (recommended by Worldcoin docs)
if (import.meta.env.VITE_ENABLE_ERUDA === 'true') {
  import('eruda').then(eruda => {
    eruda.default.init();
    console.log('🧪 Eruda console activated for World App debugging');
  });
}

// Dojo & Starknet
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { dojoConfig } from "./dojo/dojoConfig";
import type { SchemaType } from "./dojo/models.gen";
import { setupWorld } from "./dojo/contracts.gen";
// PASO 1: Desconectando Cartridge Controller temporalmente
// import StarknetProvider from "./dojo/starknet-provider";
import EmptyStarknetProvider from "./dojo/EmptyStarknetProvider";

// App Entry
import Main from "../src/app/App";

// Styles
import "./global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

// Init Dojo
async function main() {
  const sdk = await init<SchemaType>({
    client: {
      toriiUrl: dojoConfig.toriiUrl,
      relayUrl: dojoConfig.relayUrl,
      worldAddress: dojoConfig.manifest.world.address,
    },
    domain: {
      name: "ByteBeasts Tamagotchi",
      version: "1.0",
      chainId: "KATANA",
      revision: "1",
    },
  });

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
        <DojoSdkProvider sdk={sdk} dojoConfig={dojoConfig} clientFn={setupWorld}>
          {/* PASO 1: EmptyStarknetProvider para prevenir crashes */}
          <EmptyStarknetProvider>
            <MiniKitProvider>
              <ChipiProvider>
                <MusicProvider>
                  {posthogInstance.initialized && posthogInstance.client ? (
                    <PostHogProvider client={posthogInstance.client}>
                      <Main />
                    </PostHogProvider>
                  ) : (
                    <Main />
                  )}
                </MusicProvider>
              </ChipiProvider>
            </MiniKitProvider>
          </EmptyStarknetProvider>
        </DojoSdkProvider>
    </StrictMode>
  );
}

main().catch((error) => {
  console.error("Failed to initialize the application:", error);
});