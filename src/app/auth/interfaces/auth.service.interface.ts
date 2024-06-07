import { ISingInCredentials } from './sing-in.interface';

export interface IAuthService {
	login(singInUserCredentials: ISingInCredentials): Promise<any>;
}
