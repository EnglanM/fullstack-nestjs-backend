import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';
import { RegisterUserDto } from '../../../common/dtos/register-user.dto';
import { UserResponseRto } from '../../../common/rtos/user-response.rto';
import { SignInUserDTO } from 'common/dtos/sign-in-user.dto';

@ApiTags('auth')
@Controller('auth')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseRto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserResponseRto> {
    return this.gatewayService.register(registerUserDto);
  }

  @Post('sign-in')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'User Sign in' })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed in',
    type: UserResponseRto,
  })
  @ApiResponse({
    status: 400,
    description: 'Wrong email/password or you need to log in',
  })
  async signIn(@Body() signInUserDto: SignInUserDTO): Promise<UserResponseRto> {
    return this.gatewayService.signIn(signInUserDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseRto],
  })
  async getAllUsers(): Promise<UserResponseRto[]> {
    return this.gatewayService.getAllUsers();
  }

  @Get('test')
  @ApiOperation({ summary: 'Test if the backend connection works' })
  @ApiResponse({ status: 201, description: 'Test successfull' })
  @ApiResponse({ status: 400, description: 'Test Unsuccessfull' })
  async test(): Promise<{ error: boolean; data: string }> {
    return this.gatewayService.test();
  }
}
