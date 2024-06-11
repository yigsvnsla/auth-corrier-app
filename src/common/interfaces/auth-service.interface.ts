import { SingInCredentialsDTO } from './dtos/sing-in-dto.interface';

export interface AuthService {
	login(singInUserCredentials: SingInCredentialsDTO): Promise<any>;
}
