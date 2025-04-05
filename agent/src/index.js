import * as readline from "node:readline";
import { coinmarketcap } from '@goat-sdk/plugin-coinmarketcap';
import { ionic } from "@goat-sdk/plugin-ionic";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { mistral } from '@ai-sdk/mistral';
import { http, createPublicClient } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo, sepolia } from "viem/chains";
import { allora } from '@goat-sdk/plugin-allora'
import { coingecko } from "@goat-sdk/plugin-coingecko";
import { ironclad } from "@goat-sdk/plugin-ironclad";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { erc20 } from "@goat-sdk/plugin-erc20";
import { safe, getAddressPlugin } from "@goat-sdk/wallet-safe";
import { creditScore } from "./contract-details.plugin.js";
import { CreditScoreService } from "./contract-details.service.js";
import axios from 'axios';

import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";
import { z } from "zod";
import { PluginBase } from "@goat-sdk/core";

// Contract address
const CONTRACT_ADDRESS = '0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b';

// Create service instance
const contractService = new CreditScoreService(CONTRACT_ADDRESS);

// Function to get text record
export async function getTextRecord(key) {
  try {
    if (!key) {
      return {
        error: 'Please provide a key to look up',
        timestamp: new Date().toISOString()
      };
    }
    
    const result = await contractService.getTextRecord(key);
    return result;
  } catch (error) {
    console.error('Error getting text record:', error);
    return {
      error: 'Failed to get text record',
      timestamp: new Date().toISOString()
    };
  }
}

// Add a function to interact with the credit score contract
async function getCreditScoreFromContract(walletAddress) {
  const contractAddress = '0x09C13a2780b8AB57b5212a1596f8ec05fE953D9D';
                          
  try {
    // Create a public client for reading from the contract
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL)
    });
    
    const result = await publicClient.readContract({
      address: contractAddress,
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "getCreditScore",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "decile",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      functionName: "getCreditScore",
      args: [walletAddress],
    });

    console.log("Contract call result:", result);
    return result;
  } catch (error) {
    console.error("Error interacting with contract:", error);
    return null;
  }
}

// Add a simple function to get credit scores
async function getCreditScore(walletAddress) {
  // Try to get data from the contract first
  const contractResult = await getCreditScoreFromContract(walletAddress);
  
  if (contractResult && Array.isArray(contractResult) && contractResult.length >= 2) {
    return {
      walletAddress: walletAddress,
      creationDate: new Date().toISOString(),
      modelVersion: "1.0.0",
      value: Number(contractResult[0]),
      decile: Number(contractResult[1]),
      valueRating: getRatingFromValue(Number(contractResult[0]))
    };
  }
  
  // Fallback to hardcoded data
  return {
    walletAddress: walletAddress,
    creationDate: new Date().toISOString(),
    modelVersion: "1.0.0",
    value: 750,
    decile: 7,
    valueRating: "Good"
  };
}

function getRatingFromValue(value) {
  if (value >= 800) return "Excellent";
  if (value >= 740) return "Very Good";
  if (value >= 670) return "Good";
  if (value >= 580) return "Fair";
  return "Poor";
}

require("dotenv").config();
const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);

export const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: sepolia,
});

// Replace the credit score plugin with a custom tool
class CreditScoreTool extends PluginBase {
  constructor() {
    super("credit-score", []);
  }

  supportsChain(chain) {
    return true;
  }

  getTools() {
    return [{
      name: "getCreditScore",
      description: "Get the credit score for a wallet address",
      parameters: z.object({
        walletAddress: z.string().describe("The wallet address to get the credit score for")
      }),
      execute: async (params) => {
        return getCreditScore(params.walletAddress);
      }
    }];
  }
}

(async () => {
    // 1. Create a wallet client
   

    // 2. Get your onchain tools for your wallet
    const tools = await getOnChainTools({
        wallet: {
            ...viem(walletClient),
            getChain: () => ({ type: 'evm', id: 1 }),
            getCoreTools: () => []
        },
        plugins: [
            coingecko({ 
                apiKey: process.env.COINGECKO_API_KEY ?? 'default-api-key',
                isPro: false
            }),
            sendETH(),
            allora({ 
                apiKey: process.env.ALLORA_API_KEY, // Contact the Allora team on Discord for access to API keys
            }),
            coinmarketcap({
                apiKey: process.env.COINMARKETCAP_API_KEY??'default-api-key' // Get it from: https://coinmarketcap.com/api/documentation/v1/
           }),
           ionic(),
           ironclad(),
           // getAddressPlugin(), // Ensure it's correctly initialized
            erc20({ tokens: [] }),
            creditScore({
                contractAddress: '0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b'
            })
        ],
    });
    

    // 3. Create a readline interface to interact with the agent
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const prompt = await new Promise((resolve) => {
            rl.question('Enter your prompt (or "exit" to quit): ', resolve);
        });

        if (prompt === "exit") {
            rl.close();
            break;
        }

        console.log("\n-------------------\n");
        console.log("TOOLS CALLED");
        console.log("\n-------------------\n");
        try {
            const result = await generateText({
                model: mistral("mistral-large-latest"),
                headers: {
                    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`, // Explicitly set API key
                },
                tools: tools,
                maxSteps: 10, // Maximum number of tool invocations per request
                prompt: prompt,
                onStepFinish: (event) => {
                    console.log(event.toolResults);
                },
            });

            console.log("\n-------------------\n");
            console.log("RESPONSE");
            console.log("\n-------------------\n");
            console.log(result.text);
        } catch (error) {
            console.error(error);
        }
    }
})();