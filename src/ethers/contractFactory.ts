import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContractFactory {
  private provider: ethers.providers.JsonRpcProvider;
  private contractsAbi: Record<string, any>;
  private communityAddress: string;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_HTTP_PROVIDER_URI);
    this.contractsAbi = this.loadContractArtifacts().GameCommunity.ABI;
    this.communityAddress = this.loadContractArtifacts().GameCommunity.GameCommunityListAddress;
  }

  // 加载所有的合约数据（从 Contract.json 文件中）
  private loadContractArtifacts(): Record<string, any> {
    const filePath = path.resolve(__dirname, 'Contract.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else {
      throw new InternalServerErrorException('Contract.json not found');
    }
  }

  // 动态创建合约实例
  createContract(contractName: string, contractAddress: string, privateKey: string): ethers.Contract {
    const contractAbi = this.contractsAbi[contractName];
    if (!contractAbi) {
      throw new InternalServerErrorException(`Contract artifact for ${contractName} not found`);
    }
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    return contract;
  }

  // 动态创建合约实例
  createCommunityContract(contractName: string, privateKey: string): ethers.Contract {
    try {
      const contractAbi = this.contractsAbi[contractName];
      if (!contractAbi) {
        throw new InternalServerErrorException(`Contract artifact for ${contractName} not found`);
      }
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contract = new ethers.Contract(this.communityAddress, contractAbi, wallet);
      return contract;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to load contract');
    }
  }
}
