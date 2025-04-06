import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

// ABI for the name registry contract
const NAME_REGISTRY_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_registry",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "available",
    "inputs": [
      {
        "name": "label",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "chainId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "coinType",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "register",
    "inputs": [
      {
        "name": "label",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registry",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IL2Registry"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "NameRegistered",
    "inputs": [
      {
        "name": "label",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NameTransferred",
    "inputs": [
      {
        "name": "label",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
];

export class NameRegistryService {
    constructor(contractAddress) {
        this.contractAddress = contractAddress;
        // Create a public client for reading from the contract
        this.publicClient = createPublicClient({
            chain: {
                ...baseSepolia,
                rpcUrls: {
                    ...baseSepolia.rpcUrls,
                    default: {
                        http: ['https://sepolia.base.org']
                    }
                }
            },
            transport: http('https://sepolia.base.org')
        });
    }

    // Check if a label is available (read function)
    async checkAvailable(label) {
        try {
            console.log('Checking if label is available:', label);
            
            // Call the available function on the contract
            const result = await this.publicClient.readContract({
                address: this.contractAddress,
                abi: NAME_REGISTRY_ABI,
                functionName: 'available',
                args: [label],
            });

            console.log('Available check result:', result);
            
            return {
                contractAddress: this.contractAddress,
                label: label,
                available: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error checking if label is available:', error);
            
            // Check if it's a contract error
            if (error.cause && error.cause.code === 'CALL_EXCEPTION') {
                return {
                    contractAddress: this.contractAddress,
                    label: label,
                    error: 'Contract call failed: ' + (error.cause.data || error.message),
                    timestamp: new Date().toISOString()
                };
            }
            
            return {
                contractAddress: this.contractAddress,
                label: label,
                error: 'Failed to check if label is available: ' + error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Register a new name (write function)
    async register(walletClient, label, owner) {
        try {
            console.log('Registering name with label:', label, 'and owner:', owner);
            
            // Validate inputs
            if (!walletClient || !label || !owner) {
                throw new Error('Missing required parameters: walletClient, label, or owner');
            }
            
            // Call the register function on the contract
            const hash = await walletClient.writeContract({
                address: this.contractAddress,
                abi: NAME_REGISTRY_ABI,
                functionName: 'register',
                args: [label, owner],
            });

            console.log('Register transaction hash:', hash);
            
            return {
                contractAddress: this.contractAddress,
                label: label,
                owner: owner,
                transactionHash: hash,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error registering name:', error);
            
            // Check if it's a contract error
            if (error.cause && error.cause.code === 'CALL_EXCEPTION') {
                return {
                    contractAddress: this.contractAddress,
                    label: label,
                    owner: owner,
                    error: 'Contract call failed: ' + (error.cause.data || error.message),
                    timestamp: new Date().toISOString()
                };
            }
            
            return {
                contractAddress: this.contractAddress,
                label: label,
                owner: owner,
                error: 'Failed to register name: ' + error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
} 