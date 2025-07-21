import { describe, it,before } from 'node:test';
import * as anchor from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { BankrunProvider } from 'anchor-bankrun';
import { startAnchor } from 'solana-bankrun';
import type { Voting } from '../target/types/Voting';
import assert from 'assert';

const IDL = require('../target/idl/voting.json');
const PROGRAM_ID = new PublicKey(IDL.address);

let provider;
let context;
let program:any;
let wallet:any ;

before(async()=>{
  context = await startAnchor('', [{ name: 'voting', programId: PROGRAM_ID }], []);
   provider = new BankrunProvider(context);
  anchor.setProvider(provider);
   wallet = provider.wallet as anchor.Wallet;
   program = new anchor.Program<Voting>(IDL, provider);
})

describe('Voting Bankrun', async () => {
  

  it('Initializes a poll', async () => {
    const pollId = new anchor.BN(1);
    const description = 'Test poll';
    const pollStart = new anchor.BN(1_000_000);
    const pollEnd = new anchor.BN(2_000_000);

    await program.methods
      .initializePoll(pollId, description, pollStart, pollEnd)
      .accounts({
        signer: wallet.publicKey,
      })
      .signers([wallet.payer])
      .rpc();

      const [pollAddress] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
        program.programId,
      )

      const poll = await program.account.poll.fetch(pollAddress);
      assert(poll.pollId.toNumber() === 1); 
      assert(poll.description === 'Test poll');
      assert(poll.pollStart.toNumber() === 1_000_000);
      assert(poll.pollEnd.toNumber() === 2_000_000);
      assert(poll.candidateAmount.toNumber() === 0);
  });

  
   it("initialize candidate", async()=>{
    await program.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    await program.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();

    const [crunchyAddress]= PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le" , 8), Buffer.from("Crunchy")],
      program.programId
    );
    const crunchyCandidate = await program.account.candidate.fetch(crunchyAddress);
    assert(crunchyCandidate.candidateVotes.toNumber() === 0);

    const [smoothAddress]= PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le" , 8), Buffer.from("Smooth")],
      program.programId
    );
    const smoothCandidate = await program.account.candidate.fetch(smoothAddress);
    assert(smoothCandidate.candidateVotes.toNumber() === 0);
    console.log(crunchyCandidate);
    console.log(smoothCandidate);

   });

   it("vote", async()=>{
     await program.methods.vote(
      new anchor.BN(1),
      "Smooth"
     ).rpc();
     const [smoothAddress]= PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le" , 8), Buffer.from("Smooth")],
      program.programId
    );
    const smoothCandidate = await program.account.candidate.fetch(smoothAddress);
    console.log("thsi is smooht candidate",smoothCandidate);
    assert(smoothCandidate.candidateVotes.toNumber() === 1);
   });

});