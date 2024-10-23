export interface CommunityService {
    createCommunity(reqest: CreateCommunityRequest): Promise<Responses>;
    findAllCommunities(): Promise<FindAllCommunitiesResponses>;
    mintPoint(reqest: CreatePointsRequest): Promise<Responses>;
    findOneCommunity(reqest: FindOneCommunityRequest): Promise<FindOneCommunityResponses>;
    mintPoint(reqest:MintPointRequest):Promise<Responses>;
}


export interface CreateCommunityRequest {
    community: Community;
    userId:string;
}


export interface Community {
    communityId: string;
    communityName: string;
    communityDescription: string;
    communityCreator: string;
    communityTags: string;
    communityAddress: string;
}

export interface Responses {
    status: number;
    message: string;
    data: any;
}

export interface FindAllCommunitiesResponses {
    status: number;
    message: string;
    data: Community[];
}

export interface Point {
    pointId: string;
    pointName: string;
    pointSymbol: string;
    initialSupply: number;
    pointAddress: string;
}

export interface CreatePointsRequest {
    point: Point;
    communityId: string;
    userId:string;
}


export interface FindOneCommunityRequest {
    communityId: string;
}

export interface FindOneCommunityResponses {
    status: number;
    message: string;
    data: Community;
}


export interface MintPointRequest {
    pointId: string;
    toAddress:string;
    amount: number;
    userId:string;
}
