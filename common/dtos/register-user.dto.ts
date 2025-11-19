import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
    @ApiProperty({example: 'englanmuca@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({example: "Englan Muca"})
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({example: "Password123!", minLength: 8})
    @IsString()
    @MinLength(8)
    password: string
}