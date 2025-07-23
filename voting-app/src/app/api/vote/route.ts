import { BN, Program } from '@coral-xyz/anchor';
import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from '@solana/actions';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
const IDL = require("../../../../anchor/target/idl/voting.json");
import { Voting } from 'anchor/target/types/voting';

export async function OPTIONS(request: Request) {
  return new Response(null, { 
    status: 200, 
    headers: ACTIONS_CORS_HEADERS 
  });
}

export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: "https://t3.ftcdn.net/jpg/01/71/54/62/240_F_171546265_DV8E3F9ObHCvPjOWN6Mhr08DXwKrybR1.jpg",
    title: "Vote For Your Favorite type of Peanut Butter",
    description: "Vote between crunchy and smooth peanut butter",
    label: "vote",
    links: {
      actions: [
        {
          label: "Vote for Crunchy",
          href: "/api/vote?candidate=Crunchy"
        },
        {
          label: "Vote for Smooth",
          href: "/api/vote?candidate=Smooth"
        }
      ]
    }
  };
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");
  if (candidate !== "Crunchy" && candidate !== "Smooth") {
    return Response.json({ error: "Invalid candidate" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const body: ActionPostRequest = await request.json();
  let voter;

  const program: Program<Voting> = new Program(IDL, { connection });

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid Account", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  // ✅ DERIVE PDAs MATCHING YOUR RUST CONTRACT
  const pollId = new BN(1);

  // Derive Poll PDA - seeds: [poll_id.to_le_bytes()]
  const [pollPda] = PublicKey.findProgramAddressSync(
    [pollId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  // Derive Candidate PDA - seeds: [poll_id.to_le_bytes(), candidate_name.as_bytes()]
  const [candidatePda] = PublicKey.findProgramAddressSync(
    [pollId.toArrayLike(Buffer, "le", 8), Buffer.from(candidate)],
    program.programId
  );

  // ✅ BUILD INSTRUCTION WITH CORRECT ACCOUNTS
  const instruction = await program.methods
    .vote(pollId, candidate)
    .accounts({
      signer: voter,
      poll: pollPda,
      candidate: candidatePda
    })
    .instruction();

  const blockhash = await connection.getLatestBlockhash();
  const txn = new Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight
  }).add(instruction);

  const response = await createPostResponse({
    fields: {
      transaction: txn,
      type: "transaction"
    }
  });
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}
