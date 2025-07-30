
# 🪙 How to Create an SPL Token on Solana (Full Guide)

This guide will help you:
- Create a custom keypair and set it as your default wallet
- Create a new SPL Token mint (optionally with a vanity address)
- Initialize token metadata
- Create an associated token account
- Mint tokens
- Troubleshoot common errors

## **Prerequisites**

- [Solana CLI installed](https://docs.solana.com/cli/install-solana-cli)
- [Node.js 20+ installed, with nvm recommended]
- [@solana/spl-token CLI installed](https://spl.solana.com/token)
- **A funded Solana devnet wallet** (need some SOL on devnet for fees—use [Solana Faucet](https://solfaucet.com/) if needed)

## **Steps**

### 1. **(Optional) Use Vanity Address for your Keypair**

```sh
solana-keygen grind --starts-with your_prefix:1
```
- Example: `solana-keygen grind --starts-with bos:1`
- This finds/create a keypair with your chosen start

**Output:**  
Wrote keypair to `.json`

### 2. **Set Your Keypair as Default**

```sh
solana config set --keypair .json
```

### 3. **Set Cluster to Devnet**

```sh
solana config set --url devnet
```

### 4. **Check Your Balance**

```sh
solana balance
```
- If you see "missing signature" error, ensure `.json` is set as keypair (see step 2); or run:
  ```sh
  solana balance 
  ```

### 5. **Create a Mint Account (Token Mint)**

You can generate a mint with a vanity address if you want your token address to start with something specific, e.g. "mnt":

```sh
solana-keygen grind --starts-with mnt:1
```

### 6. **Create Your Token (SPL Mint)**

```sh
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata 
```
  * Replace `` with your generated json file from above (`mnt...json`)
  * If you use only the pubkey, use the `.json` file for mint authority

**Output:**  
Your token mint address will be shown as e.g.  
`mntYg7q85LN6zsYXFeuXTYpwHkYcPGLmkob7ofXnVQF`

### 7. **Initialize Token Metadata**

```sh
spl-token initialize-metadata    
```

- Example:
  ```sh
  spl-token initialize-metadata mntYg7q85LN6zsYXFeuXTYpwHkYcPGLmkob7ofXnVQF "chillGuy" "CHILL" https://res.cloudinary.com/dmlaqelqw/raw/upload/v1753547443/metadata_sichdh.json
  ```

**Note:**  
If your URL contains special characters (like `?`), **wrap the URL in single or double quotes**!

### 8. **Create An Associated Token Account for Yourself**

```sh
spl-token create-account 
```
This will print and create the associated account for your wallet.

### 9. **Mint Tokens**

```sh
spl-token mint  
```
- Example:  
  `spl-token mint mntYg7q85LN6zsYXFeuXTYpwHkYcPGLmkob7ofXnVQF 1000`
- By default, tokens go to your associated account (unless otherwise specified)

### 10. **Check Token Balance**

```sh
spl-token accounts
```

## **Common Errors and Solutions**

- **"default signer is required"**  
  - Set your correct keypair:  
    `solana config set --keypair .json`
- **"no matches found: " (zsh)**  
  - Escape special characters or wrap the URL in quotes.
- **Wrong command spelling**  
  - "initialize-metadata", not "intialize-metadata".

### **Sample Token Creation Command Summary**

```sh
# 1. Set keypair and network
solana config set --keypair bosG1...J2qxXhgRtAKJ2.json
solana config set --url devnet

# 2. Create vanity mint keypair (optional)
solana-keygen grind --starts-with mnt:1

# 3. Create the token mint with metadata enabled
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata mntYg7q8....json

# 4. Initialize metadata
spl-token initialize-metadata mntYg7q8... "chillGuy" "CHILL" "https://your-cdn-link/metadata.json"

# 5. Create token account
spl-token create-account mntYg7q8...

# 6. Mint tokens
spl-token mint mntYg7q8... 1000
```

## **References**

- [Solana Token CLI Docs](https://spl.solana.com/token)
- [Solana CLI Docs](https://docs.solana.com/cli/usage)
- [Solana Faucet](https://solfaucet.com/)

- [Mine_Token](https://explorer.solana.com/address/mntYg7q85LN6zsYXFeuXTYpwHkYcPGLmkob7ofXnVQF?cluster=devnet)

+------------------------------------------------------+
| bosG1mwmQyMqnK72rYUcwi5YueLELNJ2qxXhgRtAKJ2.json                  |
| (Normal Account - Wallet Keypair - you own keys)               |
| - signs transactions and pays fees                              |
+------------------------------+--------------------------------+
                               |
                               | pays for creation & signs
                               v
+------------------------------------------------------+
| mntYg7q85LN6zsYXFeuXTYpwHkYcPGLmkob7ofXnVQF.json    |
| (Normal Account - Mint Keypair - you own keys)                     |
| - defines token mint (supply, decimals, authority)                |
+------------------------------+--------------------------------+
                               |
                               | mint address (public key only, normal acc)
                               v
+------------------------------------------------------+
| Associated Token Account (ATA)                        |
| (PDA - Program Derived Address by SPL Token program) |
| - holds token balance owned by your wallet             |
| - no private key, owned and signed for by token program |
+------------------------------------------------------+
