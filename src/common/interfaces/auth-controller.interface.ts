import { SingInCredentialsDTO } from './dtos/sing-in-dto.dto';
import { UserDTO } from './user.interface';

export interface IAuthController {
	SingIn(credentials: SingInCredentialsDTO): Promise<UserDTO>;
}
