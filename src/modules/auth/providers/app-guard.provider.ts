import { APP_GUARD } from '@nestjs/core';
import { Provider } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';

export const APP_GUARD_PROVIDER: Provider = {
	provide: APP_GUARD,
	useClass: JwtAuthGuard,
};
