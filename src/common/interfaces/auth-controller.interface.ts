import { SingInCredentialsDTO } from './dtos/sing-in-dto.interface';
import { IUser } from './user.interface';

export interface IAuthController {
	SingIn(credentials: SingInCredentialsDTO): Promise<IUser>;
}
