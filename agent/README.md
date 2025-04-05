# NameFlow Agent

This is a JavaScript-based API server for interacting with blockchain contracts.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
2. Navigate to the agent directory
3. Install dependencies:

```bash
npm install
```

### API Server

The API server is already deployed at: https://ethglobal-taipei-4xxj9.ondigitalocean.app/

### API Endpoints

The server provides the following API endpoints:

- `POST /api/text-record` - Get a text record (requires key in body)
- `GET /api/owner` - Get the contract owner
- `GET /api/base-node` - Get the base node
- `GET /api/symbol` - Get the contract symbol

### Example Usage

You can test these endpoints using curl or any API client like Postman:

```bash
# Get a text record
curl -X POST https://ethglobal-taipei-4xxj9.ondigitalocean.app/api/text-record -H "Content-Type: application/json" -d '{"key":"description"}'

# Get the contract owner
curl https://ethglobal-taipei-4xxj9.ondigitalocean.app/api/owner

# Get the base node
curl https://ethglobal-taipei-4xxj9.ondigitalocean.app/api/base-node

# Get the symbol
curl https://ethglobal-taipei-4xxj9.ondigitalocean.app/api/symbol
```

### Development

For development with auto-restart on file changes:

```bash
npm run watch
```

This uses nodemon to automatically restart the server when files change.

## Project Structure

- `src/server.js` - Main server file
- `src/contract-details.service.js` - Service for interacting with blockchain contracts
- `src/contract-details.plugin.js` - Plugin for integrating with the GOAT SDK
- `src/text-record-client.js` - Client for interacting with the API
- `src/run-text-record-client.js` - Example script for using the client 