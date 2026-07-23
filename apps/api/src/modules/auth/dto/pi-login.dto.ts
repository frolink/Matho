import { IsString, MinLength } from 'class-validator';

export class PiLoginDto {
  @IsString()
  @MinLength(10, { message: 'accessToken looks too short to be a valid Pi access token.' })
  accessToken!: string;
}
