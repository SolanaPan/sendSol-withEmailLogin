import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { walletAddress } from "../constants";
import "../styles/mix.css";
import { ToastContainer, toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getSolPriceInEuro, getSolAmountFromWallet, sendSolana } from "../utils/utils";
import PHWallet from "./wallet";

const Dashboard = () => {
  const navigate = useNavigate();
  const [euroAmount, setEuroAmount] = useState(0);
  const [myAddress, setMyAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const { email, affiliateLink } = userInfo;

  const {wallet, publicKey} = useWallet();
  const { connection } = useConnection();

  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSubmit = async () => {
    try {
      if (!publicKey || !publicKey == null) {
        console.log(wallet.adapter.publicKey);
        toast.error("Please connect your wallet");
        return;
      }

      if (euroAmount == 0) {
        toast.error("Please input Euro amount");
        return;
      }
      setLoading(true);
      const solPrice = await getSolPriceInEuro();
      console.log('--solPrice--', solPrice)
      if (solPrice == 0) {
        toast.error("Get solana price failed")
        return;
      }

      const sendSolAmount = euroAmount / solPrice;

      const solBalance = await getSolAmountFromWallet(connection, publicKey);
      console.log('--solbalance--', solBalance, sendSolAmount);
      if (solBalance < sendSolAmount) {
        toast.error("There is no enough solana");
        return;
      }

      const success = await sendSolana(connection, wallet, affiliateLink, sendSolAmount);
      if (success) {
        toast.success("Send solana success");
      } else {
        toast.error("Send solana failed");
      }
    } catch (e) {
      console.log(e);
      toast.error("Error occurred while sending solana");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PHWallet />
      <section style={{ fontFamily: "cursive", fontSize: "20px" }}>
        <div className="form_data">
          <div>
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
                onChange={(e) => setEuroAmount(Number(e.target.value))}
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
            <button
              className="btn"
              onClick={handleSubmit}
              style={{
                width: "430px",
                backgroundColor: "green",
                height: "50px",
                borderRadius: "20px",
                color: "white",
                fontSize: "20px",
                fontFamily: "cursive",
              }}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Sending..." : "Send"}
            </button>
            <button
              className="btn"
              onClick={handleLogOut}
              style={{
                width: "430px",
                backgroundColor: "green",
                height: "50px",
                borderRadius: "20px",
                color: "white",
                fontSize: "20px",
                fontFamily: "cursive",
              }}
              disabled={loading} // Disable button when loading
            >
              Log out
            </button>
          </div>
        </div>
        <ToastContainer autoClose={3000} draggableDirection="x" />
      </section>
    </>
    // </WalletConnectProvider>
  );
};

export default Dashboard;
