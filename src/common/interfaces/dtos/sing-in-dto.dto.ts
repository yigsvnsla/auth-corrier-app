import { IsNotEmpty, IsString } from 'class-validator';

export class SingInCredentialsDTO {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
