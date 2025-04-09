"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcrypt");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        try {
            const user = await this.userService.findOneByEmail(email);
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                this.logger.warn(`Failed login attempt for user: ${email}`);
                throw new common_1.UnauthorizedException("Wrong password");
            }
            const payload = {
                sub: user.id,
                email: user.email,
            };
            const token = this.jwtService.sign(payload);
            this.logger.log(`User logged in: ${email}`);
            return {
                access_token: token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Login error: ${error.message}`);
            }
            else {
                this.logger.error("Login error: Unknown error");
            }
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
    }
    async signup(createUserDto) {
        try {
            const user = await this.userService.create(createUserDto);
            this.logger.log(`New user registered: ${user.email}`);
            return {
                message: "Registration successful",
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            if (error instanceof Error) {
                this.logger.error(`Registration error: ${error.message}`, error.stack);
            }
            else {
                this.logger.error("Registration error: Unknown error");
            }
            throw new common_1.ConflictException("Account creation failed. Please try again.");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map