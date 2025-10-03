"use client"
import SendSol from "@/components/send-sol/SendSol";
import WalletConnectButton from "@/components/wallet/CustomWalletButton";

export default function Home() {
  return (
   <div className="min-h-screen bg-black">
    <header className="w-full border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Solana Wallet</h1>
        <WalletConnectButton/>
      </div>
    </header>
    <main className="w-full">
      <SendSol/>
    </main>
   </div>
  );
}
