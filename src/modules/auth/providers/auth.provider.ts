import { Provider } from '@nestjs/common';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants/tokens';
import { AuthServiceImpl } from '../auth.service';

export const AUTH_PROVIDER: Provider = {
	provide: AUTH_SERVICE_TOKEN,
	useClass: AuthServiceImpl,
};
