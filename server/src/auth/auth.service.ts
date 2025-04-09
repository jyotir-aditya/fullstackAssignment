import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  /**
   * Handles user login
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Find the user by their email
      const user = await this.userService.findOneByEmail(email);

      // bcrypt compare the password
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        this.logger.warn(`Failed login attempt for user: ${email}`);
        throw new UnauthorizedException("Wrong password");
      }

      // If we get here password is valid - create JWT
      const payload = {
        sub: user.id, // standard JWT subject
        email: user.email,
      };

      const token = this.jwtService.sign(payload);

      this.logger.log(`User logged in: ${email}`);

      // Return both token and basic user info
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      // Log the actual error but return generic message
      if (error instanceof Error) {
        this.logger.error(`Login error: ${error.message}`);
      } else {
        this.logger.error("Login error: Unknown error");
      }

      // Don't reveal whether the user exists
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  /**
   * Creates a new user account
   */
  async signup(createUserDto: CreateUserDto) {
    try {
      // This method already hashes password
      const user = await this.userService.create(createUserDto);

      this.logger.log(`New user registered: ${user.email}`);

      return {
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      // Pass through specific errors from user service
      if (error instanceof ConflictException) {
        throw error;
      }

      // Log full error but return simpler message
      if (error instanceof Error) {
        this.logger.error(`Registration error: ${error.message}`, error.stack);
      } else {
        this.logger.error("Registration error: Unknown error");
      }
      throw new ConflictException("Account creation failed. Please try again.");
    }
  }

  // TODO: Implement password reset flow
}
