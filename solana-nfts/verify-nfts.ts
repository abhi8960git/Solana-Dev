import {
    createNft,
    fetchDigitalAsset,
    findMetadataPda,
    mplTokenMetadata,
    verifyCollectionV1,
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
    publicKey,
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

  const collectionAddress = publicKey("3f7DcCzc8pW6YPSTLku9mGeeTh4vKjtK8dYC6yfthBp1");
  const nftaddress = publicKey("4JKgrBcuAcHNj57o9dG2cVa16iGZxKkBCfWLBywqznRo");
  console.log("verifying NFTs..");

  const txn = await verifyCollectionV1(umi,{
    metadata:findMetadataPda(umi, {mint:nftaddress}),
    collectionMint:collectionAddress,
    authority:umi.identity,
  }).sendAndConfirm(umi,{send:{commitment:"finalized"}});

  await new Promise(resolve => setTimeout(resolve,9000));

  console.log("NFT GOT VERIFIED", getExplorerLink("address",nftaddress,"devnet"));