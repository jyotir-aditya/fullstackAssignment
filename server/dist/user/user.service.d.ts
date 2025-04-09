import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private configService;
    private supabase;
    private logger;
    constructor(configService: ConfigService);
    create(dto: CreateUserDto): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    findOneById(id: string): Promise<User>;
}
