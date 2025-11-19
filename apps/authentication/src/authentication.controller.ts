import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from '../../../common/dtos/register-user.dto';
import { SignInUserDTO } from 'common/dtos/sign-in-user.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ cmd: 'test' })
  helloWorld() {
    return { error: false, data: 'hello world' };
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() registerUserDto: RegisterUserDto) {
    const user = await this.authenticationService.register(registerUserDto);
    return { error: false, data: user };
  }

  @MessagePattern({ cmd: 'sign-in' })
  async signIn(@Payload() signInUserDto: SignInUserDTO) {
    const user = await this.authenticationService.signIn(signInUserDto);
    return { error: false, data: user };
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers() {
    const users = await this.authenticationService.getAllUsers();
    return { error: false, data: users };
  }
}
