import { PluginBase } from './plugin-base.js';
import { z } from 'zod';
import { NameRegistryService } from './name-registry.service.js';

export class NameRegistryPlugin extends PluginBase {
    constructor(params = {}) {
        super(params);
        this.contractAddress = params.contractAddress || '0x09c13a2780b8ab57b5212a1596f8ec05fe953d9d';
    }

    getTools() {
        return [
            {
                name: 'checkAvailable',
                description: 'Check if a name label is available for registration',
                parameters: z.object({
                    label: z.string().describe('The name label to check availability for')
                }),
                execute: async (params) => {
                    if (!params.label) {
                        return {
                            error: 'Please provide a label to check',
                            timestamp: new Date().toISOString()
                        };
                    }
                    const service = new NameRegistryService(this.contractAddress);
                    return service.checkAvailable(params.label);
                }
            },
            {
                name: 'register',
                description: 'Register a new name with a label and owner',
                parameters: z.object({
                    label: z.string().describe('The name label to register'),
                    owner: z.string().describe('The owner address for the name'),
                    walletClient: z.any().optional().describe('Optional wallet client for the transaction')
                }),
                execute: async (params) => {
                    if (!params.label || !params.owner) {
                        return {
                            error: 'Please provide both label and owner',
                            timestamp: new Date().toISOString()
                        };
                    }
                    const service = new NameRegistryService(this.contractAddress);
                    return service.register(params.walletClient, params.label, params.owner);
                }
            }
        ];
    }
}

export const nameRegistry = (params = {}) => {
    return new NameRegistryPlugin(params);
}; 