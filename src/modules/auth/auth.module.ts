import { Module } from '@nestjs/common';
import { AuthServiceImpl } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ODIC_PROVIDER } from './middlewares/OIDC.provider';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants/tokens';

@Module({
	imports: [PassportModule.register({ session: true })],
	controllers: [AuthController],
	providers: [
		{
			provide: AUTH_SERVICE_TOKEN,
			useClass: AuthServiceImpl,
		},
		ODIC_PROVIDER,
	],
	exports: [AUTH_SERVICE_TOKEN],
})
export class AuthModule {}
