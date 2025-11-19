import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RegisterUserDto } from '../../../../common/dtos/register-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInUserDTO } from 'common/dtos/sign-in-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    const createdUser = new this.userModel({
      ...registerUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findUser(signInUserDto: SignInUserDTO): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({ email: signInUserDto.email })
      .exec();
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      signInUserDto.password,
      user.password,
    );
    if (!isPasswordValid) return null;

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
