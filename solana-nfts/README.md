# Solana NFTs Project

A TypeScript project for creating, managing, and verifying NFTs on the Solana blockchain using the Metaplex Token Metadata program.

## 🎯 Project Overview

This project demonstrates how to:
- Create NFT collections on Solana devnet
- Mint individual NFTs and associate them with collections
- Verify NFTs as part of a collection
- Manage NFT metadata and attributes

## 📁 Project Structure

```
solana-nfts/
├── create-collection.ts    # Creates a new NFT collection
├── create-nfts.ts         # Mints individual NFTs
├── verify-nfts.ts         # Verifies NFTs as part of a collection
├── package.json           # Project dependencies
└── README.md             # This file
```

## 🚀 Live Examples

### Collection
- **Collection Address**: `3f7DcCzc8pW6YPSTLku9mGeeTh4vKjtK8dYC6yfthBp1`
- **Explorer Link**: [View Collection on Solana Explorer](https://explorer.solana.com/address/3f7DcCzc8pW6YPSTLku9mGeeTh4vKjtK8dYC6yfthBp1/transfers?cluster=devnet)
- **Collection Name**: Kenpachi Collection
- **Symbol**: KENP

### NFT
- **NFT Address**: `4JKgrBcuAcHNj57o9dG2cVa16iGZxKkBCfWLBywqznRo`
- **Explorer Link**: [View NFT on Solana Explorer](https://explorer.solana.com/address/4JKgrBcuAcHNj57o9dG2cVa16iGZxKkBCfWLBywqznRo/metadata?cluster=devnet)
- **NFT Name**: Zaraki Kenpachi

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- Solana CLI tools
- A Solana wallet keypair file

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-nfts
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Solana keypair:
```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

## 🔧 Configuration

The project uses the following key dependencies:
- `@metaplex-foundation/mpl-token-metadata`: For NFT metadata operations
- `@metaplex-foundation/umi-bundle-defaults`: UMI framework for Solana
- `@solana-developers/helpers`: Helper utilities for Solana development
- `@solana/web3.js`: Solana Web3.js library

## 📝 Usage

### 1. Create a Collection

Run the collection creation script:
```bash
npx esrun create-collection.ts
```

This will:
- Create a new NFT collection with the name "Kenpachi Collection"
- Set the collection symbol to "KENP"
- Use metadata from Cloudinary
- Set seller fee to 0%
- Output the collection address

### 2. Create NFTs

Run the NFT creation script:
```bash
npx esrun create-nfts.ts
```

This will:
- Mint a new NFT named "Zaraki Kenpachi"
- Associate it with the specified collection
- Use metadata from Cloudinary
- Set seller fee to 0%
- Output the NFT address

### 3. Verify NFTs

Run the verification script:
```bash
npx esrun verify-nfts.ts
```

This will:
- Verify the NFT as part of the collection
- Update the collection verification status
- Confirm the NFT belongs to the collection

## 🔗 Metadata

The project uses Cloudinary-hosted metadata:

### Collection Metadata
- **URI**: `https://res.cloudinary.com/dmlaqelqw/raw/upload/v1753772303/KenpachiMetadata_bqipsg.json`

### NFT Metadata
- **URI**: `https://res.cloudinary.com/dmlaqelqw/raw/upload/v1753849000/NFT_dcsuxk.json`

## 🌐 Network

This project operates on **Solana Devnet** for testing purposes. All transactions and addresses are on the devnet cluster.

## 💡 Key Features

- **Automatic Airdrops**: Scripts automatically request SOL airdrops if needed
- **Balance Checking**: Built-in balance verification before transactions
- **Retry Logic**: Robust error handling with retry mechanisms
- **Explorer Links**: Automatic generation of Solana Explorer links
- **Collection Management**: Full collection creation and verification workflow

## 🚨 Important Notes

1. **Devnet Only**: This project is configured for Solana devnet
2. **Keypair Required**: Ensure you have a valid Solana keypair file
3. **SOL Balance**: Scripts will automatically airdrop SOL if needed
4. **Transaction Confirmation**: All transactions wait for finalization
5. **Metadata Hosting**: Uses Cloudinary for metadata storage

## 🔍 Troubleshooting

### Common Issues

1. **Insufficient Balance**: Scripts will automatically airdrop SOL
2. **Transaction Failures**: Check network connectivity and retry
3. **Metadata Issues**: Ensure Cloudinary URLs are accessible
4. **Keypair Errors**: Verify your Solana keypair file exists

### Error Handling

The scripts include:
- Automatic retry logic for failed transactions
- Balance checking before operations
- Detailed error logging
- Graceful timeout handling

## 📚 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Metaplex Documentation](https://docs.metaplex.com/)
- [Solana Explorer](https://explorer.solana.com/)
- [UMI Framework](https://docs.metaplex.com/umi/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the ISC License.

---

**Note**: This project is for educational and development purposes. Always test thoroughly on devnet before deploying to mainnet. 