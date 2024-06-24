import { Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from '../interceptors/logger.interceptor';

export const APP_INTERCEPTOR_LOGGER_PROVIDER: Provider = {
	provide: APP_INTERCEPTOR,
	useClass: LoggerInterceptor,
};
