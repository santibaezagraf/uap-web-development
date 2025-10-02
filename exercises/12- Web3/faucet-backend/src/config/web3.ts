import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

export const FAUCET_TOKEN_ABI = [
    {
        inputs: [],
        name: "claimTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "hasAddressClaimed",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getFaucetUsers",
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getFaucetAmount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function",
    },
] as const;

// Provider para lectura
export const provider = new ethers.JsonRpcProvider(
    process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
)

// Wallet para transacciones
export const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    provider
)

// Instancia del contrato
export const faucetContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    FAUCET_TOKEN_ABI,
    wallet
)

