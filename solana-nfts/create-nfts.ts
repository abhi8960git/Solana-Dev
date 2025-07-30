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

//save address for collection 

const collectionAddress = publicKey("3f7DcCzc8pW6YPSTLku9mGeeTh4vKjtK8dYC6yfthBp1");

console.log("creating NFT..");

const mint = generateSigner(umi);

const txn = await createNft(umi, {
    mint,
    name: "Zaraki Kenpachi",
    uri: "https://res.cloudinary.com/dmlaqelqw/raw/upload/v1753849000/NFT_dcsuxk.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        verified: false
    }
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });

await new Promise(resolve => setTimeout(resolve, 9000));

const createdNFt = await fetchDigitalAsset(umi, mint.publicKey);

console.log(`Create NFT Address is ${getExplorerLink("address", createdNFt.mint.publicKey, "devnet")}`)


