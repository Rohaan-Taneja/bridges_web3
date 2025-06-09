This is the backend/indexer for our cross-chain bridge.

When a user deposits ETH into our Ethereum bridge contract, it triggers the lock function.

This lock function emits an event on the Ethereum blockchain.

After the transaction is confirmed, the frontend calls this backend API.

The backend reads the transaction logs to detect and verify the event emitted by our Ethereum contract.

Once verified, it sends the relevant details to the Avalanche bridge contract to complete the cross-chain transfer.

This setup ensures a secure and automated way to move assets from Ethereum to Avalanche.
