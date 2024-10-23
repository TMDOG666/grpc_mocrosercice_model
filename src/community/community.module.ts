import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Community, PointsCommunitiesMid, Point } from '../entities/community.entity';
import { UtilsModule } from 'src/common/utils/utils.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { EthersModule } from 'src/ethers/web3.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Community, PointsCommunitiesMid, Point]),
        UtilsModule,
        EthersModule,
        ClientsModule.registerAsync([
            {
                name: 'USER_PACKAGE',
                useFactory: async () => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'user',
                        protoPath: join(__dirname, '../proto/user.proto'),
                        url: 'localhost:50052',
                    },
                }),
            }
        ])
    ],
    controllers: [CommunityController],
    providers: [CommunityService],
})
export class CommunityModule { }