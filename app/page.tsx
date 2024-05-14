"use client"
import { Analytics } from "@vercel/analytics/react";

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
} from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'a0dd23157746b39315f34b62eb614eae',
  chains: [mainnet, polygon, optimism, arbitrum, base],
});

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

const queryClient = new QueryClient();

export default async function App() {



  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Home />
          {serverConfig?.isVercel && <Analytics />}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
