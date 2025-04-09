import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
export declare class AuthService {
    private jwtService;
    private userService;
    private readonly logger;
    constructor(jwtService: JwtService, userService: UserService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    signup(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
        };
    }>;
}
