import React from "react";
import { toast } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Header() {
  const { select, wallets, publicKey, disconnect } = useWallet();
  console.log(select, wallets, publicKey, disconnect);

  const onWalletConnect = () => {
    if (!publicKey) {
      const installedWallets = wallets.filter(
        (wallet) => wallet.readyState === "Installed"
      );
      if (installedWallets.length <= 0) {
        toast.warning("Phantom wallet is not installed yet.");
        return;
      }
      select(wallets[0].adapter.name);
    } else {
      disconnect();
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="w-full max-w-[1440px] px-5 py-9 relative">
        <div className="absolute top-0 flex flex-row items-center h-full right-5">
          <button
            onClick={onWalletConnect}
            className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
          >
            {!publicKey
              ? "CONNECT WALLET"
              : publicKey.toBase58().slice(0, 6) +
                " ... " +
                publicKey.toBase58().slice(-6)}
          </button>
        </div>
      </div>
    </div>
  );
}
