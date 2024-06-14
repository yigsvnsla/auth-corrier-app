import { IntrospectionResponse } from 'openid-client';
import { SingInCredentialsDTO } from './dtos/sing-in-dto.dto';

export interface AuthService {
	login(singInUserCredentials: SingInCredentialsDTO): Promise<any>;
	validateToken(token: string): Promise<IntrospectionResponse>;
}
