import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Voting } from "../target/types/voting";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("Voting Bankrun", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Voting as Program<Voting>;
  const wallet = provider.wallet as anchor.Wallet;

  // ✅ Use dynamic poll ID to avoid conflicts
  const pollId = new BN(Date.now()); // Unique poll ID each run
  const pollDescription = "Vote for your favorite peanut butter!";
  const pollStart = new BN(0);
  const pollEnd = new BN(9999999999);

  // Derive PDAs
  let pollPda: PublicKey;
  let crunchyCandidatePda: PublicKey;
  let smoothCandidatePda: PublicKey;

  beforeAll(async () => {
    // Derive all PDAs
    [pollPda] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    [crunchyCandidatePda] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from("Crunchy")],
      program.programId
    );

    [smoothCandidatePda] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
      program.programId
    );

    console.log("Poll ID:", pollId.toString());
    console.log("Poll PDA:", pollPda.toString());
    console.log("Crunchy Candidate PDA:", crunchyCandidatePda.toString());
    console.log("Smooth Candidate PDA:", smoothCandidatePda.toString());
  });

  it("Initializes a poll", async () => {
    const tx = await program.methods
      .initializePoll(pollId, pollDescription, pollStart, pollEnd)
      .accounts({
        signer: wallet.publicKey,
        poll: pollPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize poll transaction signature:", tx);

    const pollAccount = await program.account.poll.fetch(pollPda);
    expect(pollAccount.pollId.toString()).toBe(pollId.toString());
    expect(pollAccount.description).toBe(pollDescription);
    expect(pollAccount.candidateAmount.toString()).toBe("0");
  });

  it("Initialize Crunchy candidate", async () => {
    const tx = await program.methods
      .initializeCandidate("Crunchy", pollId)
      .accounts({
        signer: wallet.publicKey,
        poll: pollPda,
        candidate: crunchyCandidatePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize Crunchy candidate transaction signature:", tx);

    const candidateAccount = await program.account.candidate.fetch(crunchyCandidatePda);
    expect(candidateAccount.candidateName).toBe("Crunchy");
    expect(candidateAccount.candidateVotes.toString()).toBe("0");

    const pollAccount = await program.account.poll.fetch(pollPda);
    expect(pollAccount.candidateAmount.toString()).toBe("1");
  });

  it("Initialize Smooth candidate", async () => {
    const tx = await program.methods
      .initializeCandidate("Smooth", pollId)
      .accounts({
        signer: wallet.publicKey,
        poll: pollPda,
        candidate: smoothCandidatePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize Smooth candidate transaction signature:", tx);

    const candidateAccount = await program.account.candidate.fetch(smoothCandidatePda);
    expect(candidateAccount.candidateName).toBe("Smooth");
    expect(candidateAccount.candidateVotes.toString()).toBe("0");

    const pollAccount = await program.account.poll.fetch(pollPda);
    expect(pollAccount.candidateAmount.toString()).toBe("2");
  });

  it("Vote for Crunchy", async () => {
    const tx = await program.methods
      .vote(pollId, "Crunchy")
      .accounts({
        signer: wallet.publicKey,
        poll: pollPda,
        candidate: crunchyCandidatePda,
      })
      .rpc();

    console.log("Vote for Crunchy transaction signature:", tx);

    const candidateAccount = await program.account.candidate.fetch(crunchyCandidatePda);
    expect(candidateAccount.candidateVotes.toString()).toBe("1");
  });

  it("Vote for Smooth", async () => {
    const tx = await program.methods
      .vote(pollId, "Smooth")
      .accounts({
        signer: wallet.publicKey,
        poll: pollPda,
        candidate: smoothCandidatePda,
      })
      .rpc();

    console.log("Vote for Smooth transaction signature:", tx);

    const candidateAccount = await program.account.candidate.fetch(smoothCandidatePda);
    expect(candidateAccount.candidateVotes.toString()).toBe("1");
  });

  it("Fetch final poll results", async () => {
    const pollAccount = await program.account.poll.fetch(pollPda);
    const crunchyCandidate = await program.account.candidate.fetch(crunchyCandidatePda);
    const smoothCandidate = await program.account.candidate.fetch(smoothCandidatePda);

    console.log("=== FINAL POLL RESULTS ===");
    console.log("Poll ID:", pollAccount.pollId.toString());
    console.log("Description:", pollAccount.description);
    console.log("Total Candidates:", pollAccount.candidateAmount.toString());
    console.log("Crunchy Votes:", crunchyCandidate.candidateVotes.toString());
    console.log("Smooth Votes:", smoothCandidate.candidateVotes.toString());

    expect(pollAccount.candidateAmount.toString()).toBe("2");
    expect(crunchyCandidate.candidateVotes.toString()).toBe("1");
    expect(smoothCandidate.candidateVotes.toString()).toBe("1");
  });
});
