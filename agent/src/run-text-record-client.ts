import { fetchTextRecord } from './text-record-client';

// Function to run the text record client
async function runTextRecordClient() {
  try {
    // Get the key from command line arguments or use a default
    const key = process.argv[2] || 'description';
    
    console.log(`Fetching text record for key: ${key}`);
    const result = await fetchTextRecord(key);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error running text record client:', error);
    process.exit(1);
  }
}

// Run the function
runTextRecordClient(); 