import express from 'express';
import cors from 'cors';
import { CreditScoreService } from './contract-details.service.js';
import { NameRegistryService } from './name-registry.service.js';

// Contract addresses
const CREDIT_SCORE_ADDRESS = '0xE6Bc22b247F6c294C4C3F2852878F3e4c538098b';
const NAME_REGISTRY_ADDRESS = '0x09c13a2780b8ab57b5212a1596f8ec05fe953d9d';

// Create service instances
const creditScoreService = new CreditScoreService(CREDIT_SCORE_ADDRESS);
const nameRegistryService = new NameRegistryService(NAME_REGISTRY_ADDRESS);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Text record endpoint
app.post('/api/text-record', async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({
        error: 'Please provide a key in the request body',
        timestamp: new Date().toISOString()
      });
    }
    
    // Get text record
    const result = await creditScoreService.getTextRecord(key);
    
    // Send response
    res.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Failed to process request',
      timestamp: new Date().toISOString()
    });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { label, owner, walletClient } = req.body;
    
    if (!label || !owner) {
      return res.status(400).json({
        error: 'Please provide label and owner in the request body',
        timestamp: new Date().toISOString()
      });
    }
    
    // Create a wallet client if not provided
    let client = walletClient;
    if (!client) {
      // For testing purposes, we'll create a mock wallet client
      // In a real application, you would use a proper wallet client
      client = {
        writeContract: async ({ address, abi, functionName, args }) => {
          console.log(`Mock writeContract called with: ${functionName}(${args.join(', ')})`);
          return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        }
      };
    }
    
    // Register the name
    const result = await nameRegistryService.register(client, label, owner);
    
    // Send response
    res.json(result);
  } catch (error) {
    console.error('Error registering name:', error);
    res.status(500).json({
      error: 'Failed to register name',
      timestamp: new Date().toISOString()
    });
  }
});

// Available endpoint
app.post('/api/available', async (req, res) => {
  try {
    const { label } = req.body;
    
    if (!label) {
      return res.status(400).json({
        error: 'Please provide a label in the request body',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if label is available
    const result = await nameRegistryService.checkAvailable(label);
    
    // Send response
    res.json(result);
  } catch (error) {
    console.error('Error checking if label is available:', error);
    res.status(500).json({
      error: 'Failed to check if label is available',
      timestamp: new Date().toISOString()
    });
  }
});

// Owner endpoint
app.get('/api/owner', async (req, res) => {
  try {
    const result = await creditScoreService.getContractOwner();
    res.json(result);
  } catch (error) {
    console.error('Error getting owner:', error);
    res.status(500).json({
      error: 'Failed to get owner',
      timestamp: new Date().toISOString()
    });
  }
});

// Base node endpoint
app.get('/api/base-node', async (req, res) => {
  try {
    const result = await creditScoreService.getBaseNode();
    res.json(result);
  } catch (error) {
    console.error('Error getting base node:', error);
    res.status(500).json({
      error: 'Failed to get base node',
      timestamp: new Date().toISOString()
    });
  }
});

// Symbol endpoint
app.get('/api/symbol', async (req, res) => {
  try {
    const result = await creditScoreService.getSymbol();
    res.json(result);
  } catch (error) {
    console.error('Error getting symbol:', error);
    res.status(500).json({
      error: 'Failed to get symbol',
      timestamp: new Date().toISOString()
    });
  }
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Prevent the process from exiting
process.stdin.resume();