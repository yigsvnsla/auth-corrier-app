import {
	IntrospectionResponse,
	TokenSet,
	UnknownObject,
	UserinfoResponse,
} from 'openid-client';
import { SingInCredentialsDTO } from './dtos/sing-in-dto.dto';

export interface AuthService {
	login(singInUserCredentials: SingInCredentialsDTO): Promise<TokenSet>;
	validateToken(token: string): Promise<IntrospectionResponse>;
	userInfo(
		token: string,
	): Promise<UserinfoResponse<UnknownObject, UnknownObject>>;
}
