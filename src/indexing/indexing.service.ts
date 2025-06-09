import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config({});

interface logs {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  removed: boolean;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

@Injectable()
export class IndexingService {
  async indexEthChain() {
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_API);

    const current_block = await provider.getBlockNumber();
    const dataArray = [];

    // Get logs for the lockedEther event
    const logs = await provider.getLogs({
      address:
        process.env.ETH_CONTRACT_ADDRESS ||
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      fromBlock: current_block - 1, // Look back more blocks for testing
      toBlock: current_block + 1,
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // hash of our event
      ],
    });

    console.log(`Found ${logs.length} events`);

    // Process each log entry and sending the call to the avalanche function to notify about the event/txn
    for (const log of logs) {
      try {
        // Extract user_address from topics[1] (first indexed parameter)
        const user_address = '0x' + log.topics[1].slice(26); // This is already correct for address
        const lockId = log.topics[2]; // This is already correct for bytes32
        const amount = BigInt(log.data).toString(); // Need to convert this properly for uint256


        console.log('Event Data:', {
          user_address,
          lockId,
          amount: amount.toString(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        });

        // Call contract function with extracted data
        await this.callContractFunction(
          user_address,
          lockId,
          amount,
          log?.transactionHash!,
        );
      } catch (error) {
        console.error('Error processing log:', error);
      }
    }
  }

  // Function to call your contract with the extracted data
  async callContractFunction(user_address, lockId, amount, transactionHash) {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.AVALANCHE_RPC_API,
      );

      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

      // Your Avalanche contract should verify the source
      const contractABI = [
        `function backend_confirmation(
        address account_add,
        bytes32 lockid,
        uint256 amount
    ) external`,
      ];

      const contract = new ethers.Contract(
        process.env.AVALANCHE_CONTRACT_ADDRESS!,
        contractABI,
        wallet,
      );

      // Include the ETH contract address and transaction hash for verification
      const tx = await contract.backend_confirmation(
        user_address,
        lockId, //todo , format the inputs type according to the contract functions type
        amount,
        process.env.ETH_CONTRACT_ADDRESS!, // This shows it came from ETH contract
        transactionHash, // Pass the original ETH transaction hash
        {
          gasLimit: 300000,
        },
      );

      console.log(
        `Processing ETH lock from ${process.env.ETH_CONTRACT_ADDRESS}:`,
        tx.hash,
      );
      return await tx.wait();
    } catch (error) {
      console.error('Error calling contract function:', error);
      throw error;
    }
  }
}
