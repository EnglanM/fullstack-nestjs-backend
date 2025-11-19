import {
  Injectable,
  Inject,
  OnModuleInit,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { RegisterUserDto } from '../../../common/dtos/register-user.dto';
import { UserResponseRto } from '../../../common/rtos/user-response.rto';
import { SignInUserDTO } from 'common/dtos/sign-in-user.dto';

@Injectable()
export class GatewayService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.authClient.connect();
  }

  private handleRpcError(error: any): never {
    if (error instanceof RpcException) {
      const errorData = error.getError() as {
        status?: number;
        message?: string;
      };
      throw new HttpException(
        errorData.message || 'Internal server error',
        errorData.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async test() {
    try {
      return await firstValueFrom(this.authClient.send({ cmd: 'test' }, {}));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserResponseRto> {
    try {
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'register' }, registerUserDto),
      );
      return response.data;
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  async signIn(signInUserDto: SignInUserDTO): Promise<UserResponseRto> {
    try {
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'sign-in' }, signInUserDto),
      );
      return response.data;
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  async getAllUsers(): Promise<UserResponseRto[]> {
    try {
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'get_all_users' }, {}),
      );
      return response.data;
    } catch (error) {
      this.handleRpcError(error);
    }
  }
}
