import { SingInCredentialsDTO } from './dtos/sing-in.dto';
import { UserDTO } from './user.interface';

export interface IAuthController {
	SingIn(credentials: SingInCredentialsDTO): Promise<UserDTO>;
}
