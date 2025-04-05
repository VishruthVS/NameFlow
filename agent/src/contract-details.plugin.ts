import { PluginBase, Tool } from '@goat-sdk/core';
import { CreditScoreService } from './contract-details.service';
import { z } from 'zod';

export type CreditScorePluginCtorParams = {
    contractAddress?: string;
};

export class CreditScorePlugin extends PluginBase {
    private contractAddress: string;

    constructor(params: CreditScorePluginCtorParams = {}) {
        super('credit-score', []);
        this.contractAddress = params.contractAddress || '0x09C13a2780b8AB57b5212a1596f8ec05fE953D9D';
    }

    supportsChain(chain: any): boolean {
        return true;
    }

    getTools() {
        return [
            {
                name: 'getCreditScore',
                description: 'Get the credit score for a wallet address',
                parameters: z.object({
                    walletAddress: z.string().describe('The wallet address to get the credit score for')
                }),
                execute: async (params: any) => {
                    const service = new CreditScoreService(this.contractAddress);
                    return service.getCreditScore(params.walletClient, params.walletAddress);
                }
            },
            {
                name: 'getContractOwner',
                description: 'Get the owner of the credit score contract',
                parameters: z.object({}),
                execute: async () => {
                    const service = new CreditScoreService(this.contractAddress);
                    return service.getContractOwner();
                }
            },
            {
                name: 'getBaseNode',
                description: 'Get the base node of the credit score contract',
                parameters: z.object({}),
                execute: async () => {
                    const service = new CreditScoreService(this.contractAddress);
                    return service.getBaseNode();
                }
            },
            {
                name: 'listContractFunctions',
                description: 'List all available functions in the credit score contract',
                parameters: z.object({}),
                execute: async () => {
                    const service = new CreditScoreService(this.contractAddress);
                    return service.listContractFunctions();
                }
            }
        ];
    }
}

export const creditScore = (params: CreditScorePluginCtorParams = {}) => {
    return new CreditScorePlugin(params);
};

// export class CreditScorePlugin extends PluginBase<ViemEVMWalletClient> {
//   private service: CreditScoreService;
//   public readonly name = "credit-score";
//   public readonly toolProviders = ["get_credit_score"];

//   constructor(options?: CreditScorePluginOptions) {
//     super("credit-score", ["get_credit_score"]);
//     this.service = new CreditScoreService(
//       options?.aiServiceUrl,
//       options?.apiKey
//     );
//   }

// //   public supportsChain(chain: Chain): boolean {
// //     return true; // Support all chains for now
// //   }

// //   public getTools(): Array<typeof Tool> {
// //     return [
// //       {
// //         name: "get_credit_score",
// //         description: "Get the credit score for a wallet address",
// //         parameters: z.object({
// //           account: z.string().describe("The wallet address to get the credit score for"),
// //         }),
// //         execute: async ({ account }: { account: string }): Promise<ToolResult> => {
// //           const result = await this.service.getCreditScore({ account });
// //           return {
// //             message: `Credit score for ${account}: ${result.score.value} (${result.score.value_rating})`,
// //             data: result
// //           };
// //         },
// //       },
// //     ];
// //   }

//   static create(options?: CreditScorePluginOptions) {
//     return new CreditScorePlugin(options);
//   }
// }

// export const creditScore = (options?: CreditScorePluginOptions) => CreditScorePlugin.create(options); 