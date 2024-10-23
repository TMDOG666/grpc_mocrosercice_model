import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import * as crypto from 'crypto';
  import { extname } from 'path';
  import * as fs from 'fs';
  import { Web3Service } from './web3.service';
  
  @Controller('contract')
  export class Web3Controller {
    constructor(private readonly web3Service: Web3Service) {}
  
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './src/ethers', // 保存到当前目录
          filename: (req, file, callback) => {
            const originalName = 'Contract.json';
            callback(null, originalName);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (extname(file.originalname) !== '.json') {
            return callback(
              new BadRequestException('Only JSON files are allowed!'),
              false,
            );
          }
          callback(null, true);
        },
      }),
    )
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body('hash') providedHash: string,
    ): Promise<string> {
      if (!file) {
        throw new BadRequestException('No file uploaded!');
      }
  
      if (!providedHash) {
        throw new BadRequestException('Hash value is required!');
      }
  
      const fileBuffer = fs.readFileSync(file.path);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  
      if (hash !== providedHash) {
        fs.unlinkSync(file.path);
        throw new BadRequestException('File hash does not match!');
      }

      this.web3Service.reloadContract();
  
      return 'File uploaded and contract updated successfully';
    }
  }
  