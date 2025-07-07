// import {test,expect} from "bun:test";
// import {LiteSVM} from "litesvm";
// import {Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction} from "@solana/web3.js";

// test("liteSVM", () => {
//     const svm = new LiteSVM();
//     const doubleContract = PublicKey.unique();
//     svm.addProgramFromFile(doubleContract, "./compile.so");

//     const cpiContract = PublicKey.unique();
//     svm.addProgramFromFile(cpiContract, "./cpi.so");

//     let userAcc = new Keypair();
//     let dataAccount = new Keypair();

//     svm.airdrop(userAcc.publicKey, BigInt(1000_000_000));
    
//     createDataAccountOnchain(svm,dataAccount,userAcc,doubleContract);

//     let ix = new TransactionInstruction(
//         {
// 			keys: [
// 				{ pubkey: dataAccount.publicKey, isSigner: true, isWritable: true },
//                 {pubkey:doubleContract,isSigner:false,isWritable:false},
// 			],
// 			programId: cpiContract,
// 			data: Buffer.from([0]), 
// 		}
//     )

//     let transaction = new Transaction().add(ix);
//     transaction.recentBlockhash = svm.latestBlockhash();
//     transaction.feePayer = userAcc.publicKey;
//     transaction.sign(userAcc,dataAccount); 
    
//     const dataAccountData = svm.getAccount(dataAccount.publicKey);
//     // expect(dataAccountData?.data).toEqual(Buffer.from([0]));
//     console.log("Data Account Data Before CPI:", dataAccountData?.data);
//     // expect(dataAccountData?.data).toEqual(Buffer.from([1]));
// })


// function createDataAccountOnchain(svm: LiteSVM, dataAccount: Keypair,payer: Keypair = new Keypair(),contractPubkey: PublicKey = PublicKey.unique()) {
//     // this is a helper function to create a data account onchain
//     const blockhash = svm.latestBlockhash();
// 	const ixs = [
// 		SystemProgram.createAccount({
// 			fromPubkey: payer.publicKey,
// 			newAccountPubkey: dataAccount.publicKey,
// 			lamports:Number(svm.minimumBalanceForRentExemption(BigInt(4))),
// 			space:4,
// 		    programId:contractPubkey
// 		}),
// 	];
// 	const tx = new Transaction();
// 	tx.recentBlockhash = blockhash;
// 	tx.add(...ixs);
// 	tx.sign(payer, dataAccount);
// 	svm.sendTransaction(tx);
// }