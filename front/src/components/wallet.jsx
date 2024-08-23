import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function PHWallet() {
  return (
    <>
      <div >
        <WalletModalProvider>
          <WalletMultiButton />
        </WalletModalProvider>
      </div>
    </>
  );
}
export default PHWallet;
