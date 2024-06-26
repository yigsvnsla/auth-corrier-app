import { Provider } from '@nestjs/common';
import { AUTH_SERVICE_TOKEN } from 'src/modules/auth/constants/tokens';
import { AuthServiceImpl } from '../auth.service';

export const AUTH_PROVIDER: Provider = {
	provide: AUTH_SERVICE_TOKEN,
	useClass: AuthServiceImpl,
};
