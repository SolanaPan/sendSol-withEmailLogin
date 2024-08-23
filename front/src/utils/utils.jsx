import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
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
  let val = 0;
  await axios
    .get(`${COINGECKO_API_URL}`, config)
    .then((res) => {
      console.log("sol price---", res, res.data.solana.eur);
      val = Number(res.data.solana.eur);
    })
    .catch((err) => {
      console.log("sol price---", err);
      return 0;
    });
  return val;
};

export const getSolAmountFromWallet = async (connection, publicKey) => {
  console.log("-----public key-----", publicKey);
  const balance = await connection.getBalance(publicKey);
  console.log(`Wallet Balance: ${balance / LAMPORTS_PER_SOL}`);
  return balance / LAMPORTS_PER_SOL;
};

async function sendTransaction(
  connection,
  wallet,
  transaction
) {
  if (!wallet.adapter.publicKey || !wallet.adapter.signTransaction) return null;
  try {
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.adapter.publicKey;
    const signedTransaction = await wallet.adapter.signTransaction(transaction);
    const rawTransaction = signedTransaction.serialize();

    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      preflightCommitment: 'processed',
    });
    return txid;
  } catch (e) {
    return null;
  }
}

export const sendSolana = async (connection, wallet, affiliate_link, solAmount) => {
  console.log("affiliate link: ", affiliate_link);
  console.log("sol amount: ", solAmount);
  console.log(wallet.adapter.publicKey.toBase58());
  try {
    const lamportsToSendAffiliate = (solAmount * 10) / 100;
    const lamportsToSendTarget = solAmount - lamportsToSendAffiliate;

    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: wallet.adapter.publicKey,
        toPubkey: new PublicKey(affiliate_link),
        lamports: Math.floor(lamportsToSendAffiliate * LAMPORTS_PER_SOL)
      }),
      SystemProgram.transfer({
        fromPubkey: wallet.adapter.publicKey,
        toPubkey: new PublicKey(walletAddress),
        lamports: Math.floor(lamportsToSendTarget * LAMPORTS_PER_SOL)
      })
    );

    const txhash2 = await sendTransaction(connection, wallet, tx)
    if (txhash2 != null) {
			const res = await connection.confirmTransaction(txhash2);
      if(res.value.err)
      {
        console.log('Transaction confirm error--', res.value.err);
        return false
      }
		} else {
      console.log('Send transaction error')
			return false;
		}

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
