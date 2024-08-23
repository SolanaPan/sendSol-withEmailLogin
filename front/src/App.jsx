import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import SetPassword from "./components/SetPassword";
import PrivateRoute from "./components/PrivateRoute";

import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import * as web3 from "@solana/web3.js";

function App() {

  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = useMemo(() => {
    return [
      new walletAdapterWallets.PhantomWalletAdapter(),
      new walletAdapterWallets.SolflareWalletAdapter(),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <div className="App">
          {/* <nav className="bg-gray-800 p-4 text-white">
        <Link to="/" className="mr-4">
          Login
        </Link>
        <Link to="/register/:affiliateLink">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav> */}

          <div className="p-4">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/:affiliateLink" element={<Login />} />
              <Route path="/register/:affiliateLink" element={<Register />} />
              <Route path="/setpassword/:token" element={<SetPassword />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
