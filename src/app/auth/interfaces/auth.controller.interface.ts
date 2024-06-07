import { ISingInCredentials } from './sing-in.interface';
import { IUser } from './user.interface';

export interface IAuthController {
	SingIn(credentials: ISingInCredentials): Promise<IUser>;
}
