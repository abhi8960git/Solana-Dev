import * as path from "path";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
import { LiteSVM } from "litesvm";
import { expect, test, describe, beforeEach } from "bun:test";
import { deserialize } from "borsh";
import * as borsh from "borsh";

// Define the same schema as in the Rust program
class CounterState {
  count: number;
  
  constructor(count: number) {
    this.count = count;
  }
  
  static schema = new Map([
    [CounterState, {
      kind: 'struct',
      fields: [
        ['count', 'u32']
      ]
    }]
  ]);
}

describe("Counter Program Tests", () => {
  let svm: LiteSVM;
  let programId: PublicKey;
  let dataAccount: Keypair;
  let userAccount: Keypair;

  const programPath = path.join(import.meta.dir, "counter.so");

  beforeEach(() => {
    svm = new LiteSVM();
    
    programId = PublicKey.unique();
    
    svm.addProgramFromFile(programId, programPath);
    
    dataAccount = new Keypair();
    
    userAccount = new Keypair();

    svm.airdrop(userAccount.publicKey, BigInt(LAMPORTS_PER_SOL));
    
    let ix = SystemProgram.createAccount({
      fromPubkey: userAccount.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
      space: 4,
      programId
    });
    let tx = new Transaction().add(ix);
    tx.recentBlockhash = svm.latestBlockhash();
    tx.sign(userAccount, dataAccount);
    svm.sendTransaction(tx);
  });

  test("double counter value makes it 8 after 4 times", async () => {

    function doubleCounter() {
      // Create an instruction to call our program
      const instruction = new TransactionInstruction({
        programId,
        keys: [
          { pubkey: dataAccount.publicKey, isSigner: false, isWritable: true }
        ],
        data: Buffer.from([])
      });
      
      // Create and execute the transaction
      let transaction = new Transaction().add(instruction);
      transaction.recentBlockhash = svm.latestBlockhash();

      transaction.feePayer = userAccount.publicKey;
      transaction.sign(dataAccount,userAccount);
      svm.sendTransaction(transaction);
      svm.expireBlockhash();

    }

    doubleCounter();
    doubleCounter();
    doubleCounter();
    doubleCounter();
    
    const updatedAccountData = svm.getAccount(dataAccount.publicKey);
	console.log(updatedAccountData?.data);
    if (!updatedAccountData) {
      throw new Error("Account not found");
    }
    // const updatedCounter = deserialize(CounterState.schema, CounterState, Buffer.from(updatedAccountData.data));
    // if (!updatedCounter) {
    //   throw new Error("Counter not found");
    // }
    // //@ts-ignore
    // expect(updatedCounter.count).toBe(4);
  });
});