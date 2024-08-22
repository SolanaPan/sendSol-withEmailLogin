import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { walletAddress } from "../constants";
import axios from "axios";

// Define the CoinGecko API endpoint
const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur";

export const getSolPriceInEuro = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios
      .get(`${COINGECKO_API_URL}`, config)
      .then((res) => {
        console.log("sol price---", res);
        return res.response.data.solana.eur;
      })
      .catch((err) => {
        console.log("sol price---", err);
      });
    return 0;
  };

export const getSolAmountFromWallet = async () => {
  console.log("-----public key-----", wallet.publicKey.toString());
  const balance = await connection.getBalance(new PublicKey(wallet.publicKey));
  console.log(`Wallet Balance: ${balance / LAMPORTS_PER_SOL}`);
  return balance / LAMPORTS_PER_SOL;
};

export const sendSolana = async (affiliate_link, solAmount) => {
    console.log('affiliate link: ', affiliate_link);
    console.log('sol amount: ', solAmount);
    try {
        const lamportsToSendAffiliate = (solAmount * 10) / 100;
        const transferTransaction1 = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(affiliate_link),
            lamports: lamportsToSendAffiliate,
          })
        );
        await sendAndConfirmTransaction(connection, transferTransaction1, [wallet]);
      
        const lamportsToSendTarget = solAmount - lamportsToSendAffiliate;
        const transferTransaction2 = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(walletAddress),
            lamports: lamportsToSendTarget,
          })
        );
        await sendAndConfirmTransaction(connection, transferTransaction2, [wallet]);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } 
};
