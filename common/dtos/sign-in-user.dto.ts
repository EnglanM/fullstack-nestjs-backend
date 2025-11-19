import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInUserDTO {
    @ApiProperty({example: 'englanmuca@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({example: 'Password123!'})
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string; 
}