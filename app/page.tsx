"use client";
import "@fontsource/source-code-pro";
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { Analytics } from "@vercel/analytics/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  base,
  goerli,
  mainnet,
  optimism,
  polygon,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { projectId } from "../config";
import { Home } from "./components/home";
import { getServerSideConfig } from "./config/server";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora, sepolia, goerli],
  [
    alchemyProvider({ apiKey: 'Pg7_v8x8SlXaP0ZsI90QrGFxOEEJBCtA' }),
    publicProvider()
  ]
);


const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      ...(projectId ? [walletConnectWallet({ projectId, chains })] : []),
      ...(projectId ? [trustWallet({ projectId, chains })] : []),
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      ...(projectId ? [rainbowWallet({ projectId, chains })] : []),
      ...(projectId ? [okxWallet({ projectId, chains })] : []),
      ...(projectId ? [ledgerWallet({ projectId, chains })] : []),
    ],
  },
]);


export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const serverConfig = getServerSideConfig();

export default async function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} coolMode={true} theme={darkTheme()}>
            <Home />
            <ToastContainer />
          </RainbowKitProvider>
        </WagmiConfig>
        {serverConfig?.isVercel && <Analytics />}
    </>
  );
}
