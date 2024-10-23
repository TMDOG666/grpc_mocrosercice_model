import { Module } from '@nestjs/common';
import { Web3Controller } from './web3.controller';
import { Web3Service } from './web3.service';
import { ContractFactory } from './contractFactory';

@Module({
  imports: [],
  controllers: [Web3Controller],
  providers: [Web3Service,ContractFactory],
  exports: [Web3Service],
})
export class EthersModule {}
