import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { walletAddress } from "../constants";
import "../styles/mix.css";
// import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets'
import Header from "./Header";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getSolPriceInEuro, getSolAmountFromWallet, sendSolana } from "../utils/utils"

const Dashboard = () => {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { connection } = useConnection();

  const [euroAmount, setEuroAmount] = useState(0);
  const [myAddress, setMyAddress] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const { email, affiliateLink } = userInfo;

  const logOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const sendSol = () => {
    const solPrice = getSolPriceInEuro(connection, wallet);
    if (solPrice > 0) {
      console.log("solprice--", solPrice);
    }
    const sendSolAmount = euroAmount / solPrice;

    const solBalance = getSolAmountFromWallet();
    if (solBalance < sendSolAmount) {
      toast.error("There is no enough solana");
      return;
    }

    const success = sendSolana(affiliateLink, sendSolAmount);
    if (success) {
      toast.success("Send solana success");
    } else {
      toast.error("Send solana failed");
    }
  };


  return (
    <>
      <Header />
      <section style={{ fontFamily: "cursive", fontSize: "20px" }}>
        <div className="form_data">
          <form>
            <div>
              <h1>Dashboard</h1>
            </div>
            <div className="form_input">
              <label htmlFor="email">Affiliate Link:</label>
              <input
                type="text"
                name="affiliate_link"
                id="affiliate_link"
                value={affiliateLink}
                readOnly
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Wallet Address:</label>
              <input
                type="text"
                name="wallet_address"
                id="wallet_address"
                value={walletAddress}
                readOnly
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Euro:</label>
              <input
                type="number"
                name="euro_amount"
                id="euro_amount"
                onChange={(e) => setEuroAmount(e.target.value)}
                value={euroAmount}
                placeholder="Enter Euro Amount"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">My wallet address:</label>
              <input
                type="text"
                name="my_wallet"
                id="my_wallet"
                onChange={(e) => setMyAddress(e.target.value)}
                value={myAddress}
                placeholder="Enter your wallet address"
              />
            </div>
            <button onClick={sendSol}>Send</button>
            <button onClick={logOut}>logOut</button>
          </form>
        </div>
      </section>
    </>
    // </WalletConnectProvider>
  );
};

export default Dashboard;
