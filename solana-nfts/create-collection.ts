import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
  } from "@metaplex-foundation/mpl-token-metadata";
  import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
  } from "@solana-developers/helpers";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  import { LAMPORTS_PER_SOL, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
  import {
    generateSigner,
    keypairIdentity,
    percentAmount,
  } from "@metaplex-foundation/umi";
  
  const connection = new Connection(clusterApiUrl("devnet"));
  
  const user = await getKeypairFromFile();
  await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
  );

  async function printBalance(pubkey) {
   try {
    const lamports = await connection.getBalance(new PublicKey(pubkey));
    
    const sol = lamports / 1e9;
    console.log(`Balance of ${pubkey} is ${sol} SOL`);
   } catch (error) {
    console.error("Error fetching balance", error);
   }
  }
  
 
  
 
  const umi = createUmi(clusterApiUrl("devnet")).use(mplTokenMetadata());
  
  const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
  umi.use(keypairIdentity(umiUser));
  console.log("setup Umi Instance for user", umiUser.publicKey);
  
 // Check user payer balance
  await printBalance(umiUser.publicKey);
  console.log("Umi user ", umiUser.publicKey);
  
 

  const collectionMint = generateSigner(umi);

   // Check mint account balance
   await printBalance(collectionMint.publicKey);
   console.log("Collection mint ", collectionMint.publicKey);
  
  const txn = await createNft(umi, {
    mint: collectionMint,
    name: "Kenpachi Collection",
    symbol: "KENP",
    uri: "https://res.cloudinary.com/dmlaqelqw/raw/upload/v1753772303/KenpachiMetadata_bqipsg.json",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
  }).sendAndConfirm(umi,{send:{commitment:"finalized"}});
  await new Promise(resolve => setTimeout(resolve, 5000));
  // Await and print the signature and wait for finalization (helpful on devnet!)
  
  try {
    // Define the retry function
    async function fetchWithRetry(umi, mintPubkey, retries = 5) {
      for (let i = 0; i < retries; i++) {
        try {
          return await fetchDigitalAsset(umi, mintPubkey);
        } catch (e) {
          if (i === retries - 1) throw e;
          await new Promise(res => setTimeout(res, 2000)); // wait 2 seconds
        }
      }
    }
  
    // Call the retry function and await its result
    const fetchedNFTCollection = await fetchWithRetry(umi, collectionMint.publicKey);
  
    // Log the explorer link
    console.log(
        `Created Collection 📦! Address is ${getExplorerLink(
          "address",
          //@ts-ignore
          fetchedNFTCollection.mint.publicKey,
          "devnet"
        )}`
      );
  } catch (e) {
    console.error("Failed to fetch newly created NFT. Reason:", e);
  }