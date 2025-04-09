import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private supabase: SupabaseClient;
  private logger = new Logger('UserService');

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase credentials not found in environment variables');
      throw new Error('Missing Supabase credentials');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { email, password } = dto;
    
    // Check if user exists already
    // Using .maybeSingle() is better than .single() because it doesn't throw if no results
    const { data: existingUser } = await this.supabase
      .from('users')
      .select()
      .eq('email', email.toLowerCase().trim()) // normalize email 
      .maybeSingle();
    
    if (existingUser) {
      this.logger.warn(`Registration attempt with existing email: ${email}`);
      throw new ConflictException('Email already registered');
    }
    
    try {
      // Hash the password with bcrypt
      const SALT_ROUNDS = 10;
      const hashedPw = await bcrypt.hash(password, SALT_ROUNDS);
      
      // For debugging
      // console.log(`Creating user with email: ${email}`);
      
      // Create user in DB
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
        } else {
          this.logger.error('DB error creating user: Unknown error');
        }
        throw new ConflictException('Could not create user account');
      }
      
      return newUser as User;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Failed to create user: ${err.message}`);
      } else {
        this.logger.error('Failed to create user: Unknown error');
      }
      // Rethrow if it's already a NestJS exception
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new ConflictException('Registration failed');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    // Find user by email
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
      
    if (error || !user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findOneById(id: string): Promise<User> {
    // Find by ID
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      this.logger.warn(`User lookup failed for ID: ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return data;
  }
 
}
