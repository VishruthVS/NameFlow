# NameFlow: Decentralized Identity Management

NameFlow is a comprehensive platform that combines ENS domain management with World ID verification and Celo Mainnet integration.

![NameFlow Architecture](https://github.com/user-attachments/assets/424f26be-c62c-40ec-878b-4f58131f633a)

## Core Components

### 1. ENS Integration
NameFlow leverages ENS for decentralized domain management:
- Primary domain registration
- Subdomain management
- Resolver configuration
- Cross-chain name resolution

![ENS Features](https://github.com/user-attachments/assets/45489413-2bff-4316-8602-b4a0ee629a92)
![ENS Management](https://github.com/user-attachments/assets/5b3eb4e1-5ac4-4a4c-bb71-63ccf8d99d94)
![ENS Resolution](https://github.com/user-attachments/assets/cce6e35e-7227-475d-bd07-d0c837df92ef)

### 2. World ID Verification
Security layer using World ID for human verification:
- One-time verification required
- Bot prevention
- Fraud protection
- Trust and integrity assurance

![World ID Verification](https://github.com/user-attachments/assets/d261e075-006c-4c26-8ec3-bfa12c52ddfc)
![World ID Process](https://github.com/user-attachments/assets/a49b24e1-f511-4b22-8ace-e14263a2ceb9)

### 3. Celo Mainnet Integration
Authoritative registry on Celo Mainnet:
- Direct domain registration
- Transparent record keeping
- AI-powered domain management
- Decentralized asset tracking

![Celo Integration](https://github.com/user-attachments/assets/7bc85342-5fb4-49f5-ac88-51acd3fc89b4)
![Celo Management](https://github.com/user-attachments/assets/46bb84e1-3df4-47b0-99c5-c9c4aa3daa0a)

## Durin L2Registrar Setup

### Contract Addresses
- L2Registry: `0xe6bc22b247f6c294c4c3f2852878f3e4c538098b`

### Setup Process
1. Deploy L2Registrar to Base Sepolia
2. Connect L2Registrar to L2Registry by calling `addRegistrar()`
   - Transaction: [0x545e83e591cea4cf3bec26fd8d8e8a1b3573afc4c55309f4b1da38d3d50033d2](https://sepolia.basescan.org/tx/0x545e83e591cea4cf3bec26fd8d8e8a1b3573afc4c55309f4b1da38d3d50033d2)

### Registered Names
#### Primary Name
- Name: `vishruth2025taipei.eth`
- ENS App: [vishruth2025taipei.eth](https://sepolia.app.ens.domains/vishruth2025taipei.eth)

#### Subdomain
- Name: `aiagent.vishruth2025taipei.eth`
- ENS App: [aiagent.vishruth2025taipei.eth](https://sepolia.app.ens.domains/aiagent.vishruth2025taipei.eth)

## Technical Setup

### Environment Variables
Required variables in `.env`:
```
L2_RPC_URL=https://base-sepolia-rpc.publicnode.com
L2_REGISTRY_ADDRESS=0xe6bc22b247f6c294c4c3f2852878f3e4c538098b
ETHERSCAN_API_KEY=9RXDPU67MQJPTAECRSM9NGWYRWJEDRBJ8P
```

### Usage Flow
1. Complete World ID verification
2. Register domain through NameFlow interface
3. Configure resolver settings
4. Manage domains through AI agent interface

## Security Features
- World ID verification for human proof
- Decentralized registry on Celo
- Cross-chain resolution through Durin
- AI-powered domain management
- Transparent on-chain records
