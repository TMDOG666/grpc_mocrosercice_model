import { Controller, Get, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException, ClientGrpc } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js'; // Import gRPC status codes
import { CommunityService } from './community.service';
import { SnowflakeService } from 'src/common/utils/snowflake.utils';
import { Web3Service } from 'src/ethers/web3.service';
import { UserService, GetUserInfoResponse, GetUserInfoRquest } from 'src/common/interface/user.interface';
import {
    CreateCommunityRequest,
    Responses,
    FindAllCommunitiesResponses,
    FindOneCommunityRequest,
    FindOneCommunityResponses,
    CreatePointsRequest,
    MintPointRequest
} from "src/common/interface/community.interface";




@Controller()
export class CommunityController {
    private userService: UserService;
    constructor(
        private readonly communityService: CommunityService,
        private readonly snowflakeService: SnowflakeService,
        private readonly web3Service: Web3Service,
        @Inject('USER_PACKAGE') private userServiceClient: ClientGrpc
    ) { }

    onModuleInit() {
        this.userService = this.userServiceClient.getService<UserService>('UsersService');
    }

    //使用grpc通信的创建社区方法
    @GrpcMethod('CommunityService', 'CreateCommunity')
    async createCommunity(data: CreateCommunityRequest): Promise<Responses> {
        data.community.communityId = (await this.snowflakeService.generateId()).toString();
        try {
            const userInfo = await new Promise<GetUserInfoResponse>((resolve, reject) => {
                this.userService.getUserInfo({ userId: data.userId }).subscribe({
                    next: (info) => {
                        if (!info) {
                            reject({ status: status.FAILED_PRECONDITION, message: 'user not found', data: null });
                        } else {
                            resolve(info);
                        }
                    },
                    error: (err) => {
                        reject({ status: status.INTERNAL, message: err });
                    }
                });
            });
            const community = await this.communityService.findOneCommunityByName(data.community.communityName);
            if (community) return { status: status.FAILED_PRECONDITION, message: 'community already exists', data: null };
            const communityAddress = await this.web3Service.createCommunity(userInfo.data.privateKey, data.community.communityName, data.community.communityDescription, data.community.communityTags);
            data.community.communityAddress = communityAddress.events.find(event => event.event === 'CommunityCreated').args.communityAddress;
            data.community.communityCreator = communityAddress.from;
            await this.communityService.createCommunity(data.community);
            return { status: status.OK, message: 'community create successful', data: null };
        } catch (err) {
            console.error(err)
            throw new RpcException({ status: status.INTERNAL, message: err });
        }
    }

    //使用grpc通信的获取所有社区方法
    @GrpcMethod('CommunityService', 'FindAllCommunities')
    async findAllCommunities(): Promise<FindAllCommunitiesResponses> {
        try {
            const communities = await this.communityService.findAllCommunities();
            return { status: status.OK, message: 'find all communities successful', data: communities };
        } catch (err) {
            throw new RpcException({ status: status.INTERNAL, message: err });
        }
    }

    //使用grpc通信的获取指定社区方法
    @GrpcMethod('CommunityService', 'FindOneCommunity')
    async findOneCommunity(data: FindOneCommunityRequest): Promise<FindOneCommunityResponses> {
        try {
            const community = await this.communityService.findOneCommunity(data.communityId);
            return { status: status.OK, message: 'find one community successful', data: community };
        } catch (err) {
            throw new RpcException({ status: status.INTERNAL, message: err });
        }
    }

    //使用grpc通信的创建积分方法
    @GrpcMethod('CommunityService', 'CreatePoint')
    async createPoint(data: CreatePointsRequest): Promise<Responses> {
        data.point.pointId = (await this.snowflakeService.generateId()).toString();
        try {
            const userInfo = await new Promise<GetUserInfoResponse>((resolve, reject) => {
                this.userService.getUserInfo({ userId: data.userId }).subscribe({
                    next: (info) => {
                        if (!info) {
                            reject({ status: status.FAILED_PRECONDITION, message: 'user not found', data: null });
                        } else {
                            resolve(info);
                        }
                    },
                    error: (err) => {
                        reject({ status: status.INTERNAL, message: err });
                    }
                });
            });

            const community = await this.communityService.findOneCommunity(data.communityId);
            const receipt = await this.web3Service.createPoints(community.communityAddress, userInfo.data.privateKey, data.point.pointName, data.point.pointSymbol, data.point.initialSupply);
            data.point.pointAddress = receipt.events.find(event => event.event === 'GamePointCreated').args.tokenAddress;
            await this.communityService.createPoint(data.point);
            await this.communityService.createPointsCommunitiesMid({ community: community, point: data.point, pointCommunityId: null });
            return { status: status.OK, message: 'point create successful', data: null };
        } catch (err) {
            console.error(err);
            throw new RpcException({ status: status.INTERNAL, message: err });
        }
    }

    //使用grpc通信的创建积分方法
    @GrpcMethod('CommunityService', 'MintPoint')
    async mintPoint(data: MintPointRequest): Promise<Responses> {
        try {
            const userInfo = await new Promise<GetUserInfoResponse>((resolve, reject) => {
                this.userService.getUserInfo({ userId: data.userId }).subscribe({
                    next: (info) => {
                        if (!info) {
                            reject({ status: status.FAILED_PRECONDITION, message: 'user not found', data: null });
                        } else {
                            resolve(info);
                        }
                    },
                    error: (err) => {
                        reject({ status: status.INTERNAL, message: err });
                    }
                });
            });

            const point = await this.communityService.findOnePoint(data.pointId);
            await this.web3Service.mintPoints(point.pointAddress, userInfo.data.privateKey, data.toAddress, data.amount);
            return { status: status.OK, message: 'point mint successful', data: null };
        } catch (err) {
            console.error(err);
            throw new RpcException({ status: status.INTERNAL, message: err });
        }
    }
}
