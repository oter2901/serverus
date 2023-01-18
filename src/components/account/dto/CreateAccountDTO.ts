import { IsEmail, IsString } from 'class-validator';

export class CreateAccountDTO {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
