import {
	IntrospectionResponse,
	TokenSet,
	UnknownObject,
	UserinfoResponse,
} from 'openid-client';
import { SingInCredentialsDTO } from './dtos/sing-in.dto';
import { SingUpCredentialsDto } from './dtos/sing-up.dto';

export interface AuthService {
	login(singInUserCredentials: SingInCredentialsDTO): Promise<TokenSet>;
	register(singUpCredentials: SingUpCredentialsDto): Promise<any>;
	validateToken(token: string): Promise<IntrospectionResponse>;
	userInfo(
		token: string,
	): Promise<UserinfoResponse<UnknownObject, UnknownObject>>;
}
