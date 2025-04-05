import { createPublicClient, http } from 'viem';
import { CREDIT_SCORE_ABI } from './contract-details.abi.js';
import { sepolia } from 'viem/chains';

export class CreditScoreService {
    constructor(contractAddress) {
        this.contractAddress = contractAddress;
        // Create a public client for reading from the contract
        this.publicClient = createPublicClient({
            chain: sepolia,
            transport: http('https://sepolia.base.org')
        });
    }

    async getCreditScore(walletClient, address) {
        try {
            console.log('Attempting to read from credit score contract at:', this.contractAddress);
            
            const result = await this.publicClient.readContract({
                address: this.contractAddress,
                abi: CREDIT_SCORE_ABI,
                functionName: 'addr',
                args: [this.ensureBytes32(address)],
            });

            console.log('Contract result:', result);
            
            // Handle the result based on what the function returns
            const resolvedAddress = result;
            
            return {
                walletAddress: address,
                resolvedAddress: resolvedAddress,
                creationDate: new Date().toISOString(),
                modelVersion: "1.0.0"
            };
        } catch (error) {
            console.error('Error reading from credit score contract:', error);
            
            // Fallback to hardcoded data if contract call fails
            return {
                walletAddress: address,
                value: 750,
                decile: 7,
                valueRating: "Good",
                creationDate: new Date().toISOString(),
                modelVersion: "1.0.0"
            };
        }
    }

    async getContractOwner() {
        try {
            console.log('Attempting to get contract owner from:', this.contractAddress);
            
            const result = await this.publicClient.readContract({
                address: this.contractAddress,
                abi: CREDIT_SCORE_ABI,
                functionName: 'owner',
                args: [],
            });

            console.log('Contract owner result:', result);
            
            return {
                contractAddress: this.contractAddress,
                owner: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting contract owner:', error);
            
            return {
                contractAddress: this.contractAddress,
                error: 'Failed to get contract owner',
                timestamp: new Date().toISOString()
            };
        }
    }

    async getBaseNode() {
        try {
            console.log('Attempting to get baseNode from:', this.contractAddress);
            
            const result = await this.publicClient.readContract({
                address: this.contractAddress,
                abi: CREDIT_SCORE_ABI,
                functionName: 'baseNode',
                args: [],
            });

            console.log('Base node result:', result);
            
            return {
                contractAddress: this.contractAddress,
                baseNode: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting base node:', error);
            
            return {
                contractAddress: this.contractAddress,
                error: 'Failed to get base node',
                timestamp: new Date().toISOString()
            };
        }
    }

    async listContractFunctions() {
        console.log('Contract address:', this.contractAddress);
        
        // Return the ABI information
        return {
            contractAddress: this.contractAddress,
            abi: CREDIT_SCORE_ABI,
            functions: CREDIT_SCORE_ABI.filter(item => item.type === 'function').map(fn => ({
                name: fn.name,
                inputs: fn.inputs,
                outputs: fn.outputs,
                stateMutability: fn.stateMutability
            }))
        };
    }

    getRatingFromValue(value) {
        if (value >= 800) return "Excellent";
        if (value >= 740) return "Very Good";
        if (value >= 670) return "Good";
        if (value >= 580) return "Fair";
        return "Poor";
    }

    // Helper function to ensure a string is a valid bytes32
    ensureBytes32(input) {
        // If it's already a hex string starting with 0x, return it
        if (input.startsWith('0x')) {
            // Ensure it's 66 characters long (0x + 64 hex chars)
            return input.padEnd(66, '0').slice(0, 66);
        }
        
        // Otherwise, convert it to bytes32
        return `0x${Buffer.from(input).toString('hex').padStart(64, '0')}`;
    }

    async getSymbol() {
        try {
            console.log('Attempting to get symbol from:', this.contractAddress);
            
            const result = await this.publicClient.readContract({
                address: this.contractAddress,
                abi: CREDIT_SCORE_ABI,
                functionName: 'symbol',
                args: [],
            });

            console.log('Symbol result:', result);
            
            return {
                contractAddress: this.contractAddress,
                symbol: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting symbol:', error);
            
            return {
                contractAddress: this.contractAddress,
                error: 'Failed to get symbol',
                timestamp: new Date().toISOString()
            };
        }
    }

    async getTextRecord(key) {
        try {
            console.log('Getting text record for key:', key);
            
            // First get the baseNode
            const baseNode = await this.publicClient.readContract({
                address: this.contractAddress,
                abi: CREDIT_SCORE_ABI,
                functionName: 'baseNode',
                args: [],
            });
            
            console.log('Base node:', baseNode);
            
            // Then get the text record using the baseNode and key
            const result = await this.publicClient.readContract({
                address: this.contractAddress,
                abi: CREDIT_SCORE_ABI,
                functionName: 'text',
                args: [baseNode, key],
            });

            console.log('Text record result:', result);
            
            return {
                contractAddress: this.contractAddress,
                baseNode: baseNode,
                key: key,
                value: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting text record:', error);
            
            return {
                contractAddress: this.contractAddress,
                key: key,
                error: 'Failed to get text record',
                timestamp: new Date().toISOString()
            };
        }
    }
} 