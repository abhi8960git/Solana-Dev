import { Keypair } from "@solana/web3.js";
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';



const keypair = Keypair.generate();

const msg = "Here I am, Abhishek";

const msgBytes = naclUtil.decodeUTF8(msg);

// created a detacted signature from original msg 
const sign = nacl.sign.detached(msgBytes, keypair.secretKey);

const result = nacl.sign.detached.verify(
    msgBytes,sign,keypair.publicKey.toBytes()
)

console.log("Verified", result);

// so can we do this like create signature of txn in backend nd then send to user for verification bcz its safe , will try later