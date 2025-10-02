import * as bip39 from "bip39";

const mnemoic = bip39.generateMnemonic();
console.log("mnemonic", mnemoic);