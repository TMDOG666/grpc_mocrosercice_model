import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContractFactory } from './contractFactory';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  private communityListContract: ethers.Contract;

  constructor(private contractFactory: ContractFactory) {
    this.reloadContract();
  }

  // 使用合约工厂加载CommunityListContract合约
  loadContract(privateKey: string): void {
    try {
      this.communityListContract = this.contractFactory.createCommunityContract('GameCommunityList', privateKey);
    } catch (error) {
      throw new InternalServerErrorException('Failed to load contract', error);
    }
  }

  // 重新加载合约
  reloadContract(): void {
    this.loadContract(process.env.SERVICE_PRIVATE_KEY);
  }

  // 获取所有社区Address
  async getAllCommunity(): Promise<any[]> {
    try {
      if (!this.communityListContract) {
        throw new InternalServerErrorException('Contract not initialized');
      }
      const addresses: any[] = await this.communityListContract.getAllCommunities();
      return addresses;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw new InternalServerErrorException('Failed to fetch communities');
    }
  }

  // 创建社区
  async createCommunity(
    privateKey: string,
    communityName: string,
    communityDescription: string,
    communityTags: string,
  ): Promise<any> {
    try {
      this.communityListContract = this.contractFactory.createCommunityContract('GameCommunityList', privateKey);

      const tx = await this.communityListContract.createCommunity(communityName, communityDescription, communityTags, {
        gasLimit: 5000000,
        gasPrice: ethers.utils.parseUnits('5', 'gwei'),
      });

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.error('Error creating community:', error);
      throw new InternalServerErrorException('Failed to create community');
    }
  }

  // 获取签名地址
  async getAddress(message: string, signature: string): Promise<string> {
    const messageHash = ethers.utils.hashMessage(message);
    const recoveredAddress = ethers.utils.verifyMessage(messageHash, signature);
    return recoveredAddress;
  }


  // 创建积分
  async createPoints(
    communityAddress: string,
    privateKey: string,
    pointName: string,
    pointSymbol: string,
    initialSupply: number
  ): Promise<any> {
    try {
      const communityContruct = this.contractFactory.createContract('GameCommunity', communityAddress, privateKey);

      const tx = await communityContruct.createGamePoint(pointName, pointSymbol, initialSupply, {
        gasLimit: 5000000,
        gasPrice: ethers.utils.parseUnits('5', 'gwei'),
      });

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error creating points:', error);
      throw new InternalServerErrorException('Failed to create points');
    }
  }


  // 铸造积分
  async mintPoints(
    pointAddress: string,
    privateKey: string,
    toAddress:string,
    mintNumber: number
  ): Promise<any> {
    try {
      const pointContruct = this.contractFactory.createContract('GameCommunityToken', pointAddress, privateKey);

      const tx = await pointContruct.mint( toAddress,mintNumber, {
        gasLimit: 5000000,
        gasPrice: ethers.utils.parseUnits('5', 'gwei'),
      });

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error creating points:', error);
      throw new InternalServerErrorException('Failed to mint points');
    }
  }

}
