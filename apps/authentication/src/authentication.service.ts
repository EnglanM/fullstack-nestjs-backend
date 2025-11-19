// apps/authentication/src/authentication.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './users/user.repository';
import { RegisterUserDto } from '../../../common/dtos/register-user.dto';
import { UserResponseRto } from '../../../common/rtos/user-response.rto';
import { SignInUserDTO } from 'common/dtos/sign-in-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserResponseRto> {
    const existingUser = await this.userRepository.findByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userRepository.create(registerUserDto);
    return this.mapToResponseDto(user);
  }

  async signIn(SignInUserDto: SignInUserDTO): Promise<UserResponseRto> {
    const response = await this.userRepository.findUser(SignInUserDto);

    if (!response) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.mapToResponseDto(response);
  }

  async getAllUsers(): Promise<UserResponseRto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.mapToResponseDto(user));
  }

  private mapToResponseDto(user): UserResponseRto {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
