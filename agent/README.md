# NameFlow API Server and Client

This repository contains an API server and client for interacting with the NameFlow smart contract. The API server provides endpoints to retrieve text records, contract owner, base node, and symbol from the contract.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Starting the API Server

To start the API server, run:

```bash
npx ts-node src/api-server.ts
```

The server will start on port 3000 by default. You can change the port by setting the `PORT` environment variable.

## API Endpoints

### Text Record Endpoints

#### Get a Text Record by Key

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"description"}'
```

#### Get a Discord Username

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"com.discord"}'
```

#### Get a Twitter Handle

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"com.twitter"}'
```

#### Get an Email Address

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"email"}'
```

#### Get a Website URL

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"url"}'
```

#### Get an Avatar URL

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"avatar"}'
```

#### Get Keywords

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"keywords"}'
```

#### Get a Notice

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"notice"}'
```

#### Get a Location

```bash
curl -X POST http://localhost:3000/api/text-record \
  -H "Content-Type: application/json" \
  -d '{"key":"location"}'
```

### Other Endpoints

#### Get the Contract Owner

```bash
curl http://localhost:3000/api/owner
```

#### Get the Base Node

```bash
curl http://localhost:3000/api/base-node
```

#### Get the Contract Symbol

```bash
curl http://localhost:3000/api/symbol
```

## Using the Client in Code

The repository includes a client library that makes it easy to interact with the API server from your code.

### Example Usage

```typescript
import { 
  fetchTextRecord, 
  fetchContractOwner, 
  fetchBaseNode, 
  fetchSymbol 
} from './src/text-record-client';

// Get a text record
fetchTextRecord('description').then(result => console.log(result));

// Get the contract owner
fetchContractOwner().then(result => console.log(result));

// Get the base node
fetchBaseNode().then(result => console.log(result));

// Get the symbol
fetchSymbol().then(result => console.log(result));
```

## Response Format

### Successful Response

```json
{
  "contractAddress": "0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b",
  "baseNode": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "key": "com.discord",
  "value": "username#1234",
  "timestamp": "2023-04-05T12:34:56.789Z"
}
```

### Error Response

```json
{
  "contractAddress": "0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b",
  "key": "com.discord",
  "error": "Failed to get text record",
  "timestamp": "2023-04-05T12:34:56.789Z"
}
```

## Contract Details

The API server interacts with the NameFlow smart contract at address `0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b` on the Sepolia network.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 