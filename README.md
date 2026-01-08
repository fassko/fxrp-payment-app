# FXRP Payment App

A Next.js application for making FXRP payments on the Flare Coston2 testnet using the Flare Wagmi periphery package.

## Features

- Connect wallet using Web3 wallets (MetaMask, etc.)
- View FXRP balance
- Send FXRP tokens to any address
- Real-time transaction status
- Built with Next.js, Wagmi, and Tailwind CSS

## Dynamic FXRP Address Resolution

The app dynamically fetches the FXRP contract address using:
1. **FlareContractsRegistry** → `getContractAddressByName('AssetManagerFXRP')`
2. **AssetManagerFXRP** → `fAsset()` function

This ensures the correct FXRP address is always used, even if it changes.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser

4. Connect your wallet and switch to Coston2 network

## Technical Implementation

- **ERC-20 ABI**: Uses OpenZeppelin's official IERC20 interface
- **Contract ABIs**: Flare contracts use minimal required function signatures  
- **Dynamic Address**: FXRP address fetched via FlareContractsRegistry
- **SSR Support**: Proper hydration handling for Next.js
- **Type Safety**: Full TypeScript implementation

## Network Configuration

The app is configured for Flare Testnet (Coston2) using the official wagmi chain:
- Chain ID: 114
- Name: Flare Testnet
- Uses official `flareTestnet` from `@wagmi/chains`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Switch Network**: Ensure you're connected to Coston2 testnet
3. **Get Test FXRP**: Obtain test FXRP tokens from a faucet or DEX
4. **Send Payment**: Enter recipient address and amount, then confirm transaction

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
