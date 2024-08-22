'use client';
import { FC, useMemo } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

export const WalletConnectProvider = ({ children }) => {
	//input your RPC as your endpoint value
	// const network = WalletAdapterNetwork.Mainnet;
	//if main next, network is "https://fluent-side-isle.solana-mainnet.quiknode.pro/19a27fc1fa07c0a0aff254ef753b1ba030360b39/"
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			// new SolflareWalletAdapter({ network }),
			// new TorusWalletAdapter(),
		],
		[network]
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect={true}>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};