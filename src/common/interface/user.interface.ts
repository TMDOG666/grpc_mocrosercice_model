import { Observable } from 'rxjs';


export interface UserService {
    sendVerificationCodeToRegister(request: SendVerificationCodeToRegisterRequest): Observable<UserResponse>;
    verifyVerificationCodeToRegister(request: VerifyVerificationCodeToRegisterRequest): Observable<UserResponse>
    sendVerificationCodeToBindPrivateKey(request: SendVerificationCodeToBindPrivateKeyRequest): Observable<UserResponse>;
    verifyVerificationCodeToBindPrivateKey(request: VerifyVerificationCodeToBindPrivateKeyRequest): Observable<UserResponse>
    userLogin(request: LoginUserRequest): Observable<UserResponse>
    getUserInfo(request: GetUserInfoRquest): Observable<GetUserInfoResponse>

}

export interface RegisterUser {
    userId: string;
    username: string;
    address: string;
    email: string;
    profile: string;
    phoneNumber: string;
    privateKey:string;
}


export interface SendVerificationCodeToRegisterRequest {
    email: string;
}


export interface VerifyVerificationCodeToRegisterRequest {
    user: RegisterUser;
    verificationCode: string;
}

export interface SendVerificationCodeToBindPrivateKeyRequest {
    email: string;
}


export interface VerifyVerificationCodeToBindPrivateKeyRequest {
    user: RegisterUser;
    verificationCode: string;
}

export interface LoginUserRequest {
    address: string;
    message: string;
    signature: string;
}

export interface UserResponse {
    status: number;
    message: string;
}


export interface GetUserInfoRquest {
    userId:string;
}

export interface UserInfo{
    userId:string;
    username: string;
    address: string;
    email: string;
    profile: string;
    phoneNumber: string;
    privateKey:string;
}

export interface GetUserInfoResponse {
    status: number;
    message: string;
    data:UserInfo;
}