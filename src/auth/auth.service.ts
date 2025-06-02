import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { User } from '../model/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { user_accountAddress } from '../model/user_accountAddress.entity';
import { dataLength, ethers, HDNodeWallet, Wallet } from 'ethers';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';

dotenv.config({});

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(user_accountAddress)
    private readonly userAccountRepo: Repository<user_accountAddress>,
  ) {}

  async signUp(authDetails: {
    EmailId: string;
    Password: string;
  }): Promise<number> {
    const user = await this.userRepo.findOne({
      where: { emailId: authDetails?.EmailId, password: authDetails?.Password },
    });

    console.log('I am in the service , after finding', user);

    // if no existing user then we will create a new user
    if (!user) {
      const newUser = new User();
      newUser.emailId = authDetails?.EmailId;
      newUser.password = authDetails?.Password;
      const savedUser = await this.userRepo.save(newUser);

      await this.generate_user_account_keys(savedUser);

      return savedUser?.id;
    }

    return Number(user.id);
  }

  // we will generate a HD WALLET ACCOUNTetherum account for the user and saves addresses in the database
  async generate_user_account_keys(user: User) {
    const seed = bip39.mnemonicToSeedSync(
      process.env.MNEMONIC!,
      process.env.PASSKEY,
    );

    const bip32 = BIP32Factory(ecc);

    const hdNode = HDNodeWallet.fromSeed(seed);

    const path = `m/44'/60'/${user?.id}/0/0`;
    const childNode = hdNode.derivePath(path);
    console.log('this is the childnode ', childNode);
    console.log('this is the childnode ', childNode.privateKey);
    console.log('this is the childnode ', childNode.publicKey);
    console.log('this is the childnode ', childNode.address);

    const user_account = new user_accountAddress();

    user_account.accountAddress = childNode.address;
    user_account.accountPrivateKey = childNode.privateKey;
    user_account.accountPublicKey = childNode.publicKey;
    this.userAccountRepo.save(user_account);
    return true;
  }

  async getAccountAddress(userId: number): Promise<string> {
    const user_address = await this.userAccountRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!user_address) {
      throw new Error('no user found');
    }
    return user_address?.accountAddress;
  }

  // fetch the data from the blochchain
  async Indexer() {

    const provider = new ethers.JsonRpcProvider(
      'https://eth-mainnet.g.alchemy.com/v2/RtygtZRvm-k3MjBBKedUf7SYFUllE_JG',
    );

    // Choose a block number to scan
    const blockNumber = 22609709;

    // got all the txn details + txn array containing all the txh hashes
    const block = await provider.getBlock(blockNumber, true);

    if (!block) {
      return;
    }

    console.log(
      `Scanning block: ${block}, tx count: ${block?.transactions.length}`,
      typeof block?.transactions[0],
    );

    const dataArray: any = [];

    const interestedAddresses = [
      '0x9cc8A8Ca289EcC8915c6E5BDC12b9F24cD9BEad3',
      '0x25aACFaC4EC5324fCdeB358712C8e9F9F23c9a0f',
      '0x7556ce43Eed7126146751052a93959F6eE40fe54',
    ];

    let batchSize = 50;

    // jha tkk hum 50 calls karenge uske baad remainder ka batch size hoga
    let k = Math.floor(block.transactions.length/batchSize);

    let check = 0

    let txn_objects : any[] = [];
    for ( let i =0 ; i<block.transactions?.length ; i =i+batchSize){

      const batchHashes = block.transactions.slice(i , i+batchSize);

      let batchPromises = batchHashes.map(tx_hash => block.getTransaction(tx_hash));

      let batchResult = await Promise.all(batchPromises);
      
      txn_objects.push(...batchResult);
      check ++;
      if(check == k){
        batchSize = block.transactions.length%batchSize;
      }



    }


    for (const txn of txn_objects) {
      if (txn && txn.to) {
        for (let I_address of interestedAddresses) {
          if (
            // here we are just getting the address in the same format , so that they can be comparable
            ethers.getAddress(txn.to!) ===
            ethers.getAddress(I_address)
          ) {
            console.log('I found the txn');
            dataArray.push(txn);
          }
        }
      }
    }
    return dataArray;
  }
}
