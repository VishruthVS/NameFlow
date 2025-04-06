import { PluginBase } from "@goat-sdk/core";
import { z } from "zod";
import { NameRegistryService } from "./name-registry.service.js";

// Create a custom tool for name registry functions
export class NameRegistryTool extends PluginBase {
  constructor() {
    super("name-registry", []);
  }

  supportsChain(chain) {
    return true;
  }

  getTools() {
    return [
      {
        name: "checkAvailable",
        description: "Check if a name label is available for registration",
        parameters: z.object({
          label: z.string().describe("The name label to check availability for")
        }),
        execute: async (params) => {
          const service = new NameRegistryService('0x09c13a2780b8ab57b5212a1596f8ec05fe953d9d');
          return service.checkAvailable(params.label);
        }
      },
      {
        name: "register",
        description: "Register a new name with a label and owner",
        parameters: z.object({
          label: z.string().describe("The name label to register"),
          owner: z.string().describe("The owner address for the name")
        }),
        execute: async (params) => {
          // Create a mock wallet client for testing
          const mockWalletClient = {
            writeContract: async ({ address, abi, functionName, args }) => {
              console.log(`Mock writeContract called with: ${functionName}(${args.join(', ')})`);
              return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            }
          };
          
          const service = new NameRegistryService('0x09c13a2780b8ab57b5212a1596f8ec05fe953d9d');
          return service.register(mockWalletClient, params.label, params.owner);
        }
      }
    ];
  }
}

export const nameRegistryTool = () => {
  return new NameRegistryTool();
}; 