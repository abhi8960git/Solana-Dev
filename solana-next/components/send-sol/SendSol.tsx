import React, { useCallback, useMemo, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { TikTok_Sans } from "next/font/google";


export default function SendSol(){
    const {connection} = useConnection();
    const {publicKey, sendTransaction, connected} = useWallet();

    const [recipient, setRecipient] = useState("");
  const [amountSol, setAmountSol] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidRecipient = useMemo(() => {
    try {
      if (!recipient) return false;
      new PublicKey(recipient.trim());
      return true;
    } catch {
      return false;
    }
  }, [recipient]);

  const isValidAmount = useMemo(() => {
    const n = Number(amountSol);
    return Number.isFinite(n) && n > 0;
  }, [amountSol]);

  const canSubmit = connected && publicKey && isValidRecipient && isValidAmount && !loading;

  const handleSend = useCallback(async()=>{
    setError(null);
    setSignature(null);
    if (!publicKey) {
        setError("Wallet not connected");
        return;
      }
      if (!isValidRecipient) {
        setError("Invalid recipient address");
        return;
      }
      if (!isValidAmount) {
        setError("Enter a valid positive amount");
        return;
      }
  
      try {
        setLoading(true);
        const toPubkey = new PublicKey(recipient.trim());
        const lamports = Math.round(Number(amountSol) * LAMPORTS_PER_SOL);
      if (lamports <= 0) {
        throw new Error("Amount must be greater than 0 lamports");
      }
      const fromBalance = await connection.getBalance(publicKey, "confirmed");
      if (fromBalance < lamports) {
        throw new Error("Insufficient balance for this transfer");
      }

      const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey:publicKey,
            toPubkey,
            lamports
        })
      )

      tx.feePayer = publicKey;
      const latestBlockhash = await connection.getLatestBlockhash("finalized");
      tx.recentBlockhash = latestBlockhash.blockhash;

      const sig = await sendTransaction(tx, connection, {
        skipPreflight:false,
        maxRetries:3
      });

      await connection.confirmTransaction(
        {signature:sig , ...latestBlockhash},
        "confirmed"
      );
      setSignature(sig)


      } catch (error) {
        console.error(error);
        setError("Failed to send SOL");
      }finally{
        setLoading(false);
      }
  },[publicKey, recipient, amountSol, isValidRecipient, isValidAmount, connection,sendTransaction])


  return(
    <div className="max-w-lg mx-auto my-10 px-4">
        <Card className="bg-black border-gray-800">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-white">Send SOL</CardTitle>
                    <CardDescription className="text-gray-400">Transfer SOL to any Solana address</CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent className="space-y-4">
            {!connected && (
              <Alert className="bg-gray-900 border-gray-700">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-gray-300">Please connect your wallet to send SOL</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
                <Input
                id="recipient"
                type="text"
                value={recipient}
                onChange={(e)=> setRecipient(e.target.value)}
                placeholder="Enter Solana Address"
                className={`bg-gray-950 border-gray-700 text-white placeholder:text-gray-500 ${!isValidRecipient && recipient.trim().length > 0 ? "border-red-500":"focus:border-blue-500"}`}
                />
                 {!isValidRecipient && recipient.trim().length > 0 && (
              <p className="text-sm text-red-500">Invalid Solana address format</p>
            )}
            </div>
            <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              min="0"
              value={amountSol}
              onChange={(e) => setAmountSol(e.target.value)}
              placeholder="0.01"
              className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
            {!isValidAmount && amountSol.length > 0 && (
              <p className="text-sm text-red-500">Enter a valid amount greater than 0</p>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!canSubmit}
            className="w-full cursor-pointer bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send SOL"}
          </Button>
          {error && (
            <Alert variant="destructive" className="bg-red-950 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {signature && (
            <Alert className="bg-green-950 border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Transaction successful!
                <a
                  href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-1 text-blue-400 hover:text-blue-300 underline break-all"
                >
                  View on Explorer
                </a>
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        </Card>

    </div>
  )


}
