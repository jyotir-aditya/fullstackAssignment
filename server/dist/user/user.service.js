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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger('UserService');
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            this.logger.error('Supabase credentials not found in environment variables');
            throw new Error('Missing Supabase credentials');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async create(dto) {
        const { email, password } = dto;
        const { data: existingUser } = await this.supabase
            .from('users')
            .select()
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();
        if (existingUser) {
            this.logger.warn(`Registration attempt with existing email: ${email}`);
            throw new common_1.ConflictException('Email already registered');
        }
        try {
            const SALT_ROUNDS = 10;
            const hashedPw = await bcrypt.hash(password, SALT_ROUNDS);
            const { data: newUser, error } = await this.supabase
                .from('users')
                .insert([{
                    email: email.toLowerCase().trim(),
                    password: hashedPw
                }])
                .select()
                .single();
            if (error) {
                if (error instanceof Error) {
                    this.logger.error(`DB error creating user: ${error.message}`);
                }
                else {
                    this.logger.error('DB error creating user: Unknown error');
                }
                throw new common_1.ConflictException('Could not create user account');
            }
            return newUser;
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.error(`Failed to create user: ${err.message}`);
            }
            else {
                this.logger.error('Failed to create user: Unknown error');
            }
            if (err instanceof common_1.ConflictException) {
                throw err;
            }
            throw new common_1.ConflictException('Registration failed');
        }
    }
    async findOneByEmail(email) {
        const { data: user, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();
        if (error || !user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findOneById(id) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            this.logger.warn(`User lookup failed for ID: ${id}`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return data;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map