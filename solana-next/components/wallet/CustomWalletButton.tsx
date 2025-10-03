// app/components/WalletConnectButton.tsx
"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
// If using ShadCN's button component:
import { Button } from "@/components/ui/button"; // adjust import to your ShadCN setup

/**
 * ShadCN button that opens the wallet modal when not connected.
 * When connected, shows the shortened address and onClick opens account menu.
 */
export default function WalletConnectButton() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const displayAddress =
    publicKey
      ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
      : "Connect Wallet";

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => setVisible(true)}
      className="gap-2"
    >
      {/* Optional icon slot, insert your own Wallet icon here */}
      {/* <WalletIcon className="h-4 w-4" /> */}
      {connected ? displayAddress : "Connect Wallet"}
    </Button>
  );
}
