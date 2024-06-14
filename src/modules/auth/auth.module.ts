import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { OIDC_PROVIDER } from './providers/oidc.provider';
import { AUTH_PROVIDER } from './providers/auth.provider';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD_PROVIDER } from './providers/app-guard.provider';

@Module({
	imports: [
		PassportModule.register({ session: true, defaultStrategy: 'http-jwt' }),
	],
	controllers: [AuthController],
	providers: [JwtStrategy, OIDC_PROVIDER, AUTH_PROVIDER, APP_GUARD_PROVIDER],
	exports: [JwtStrategy, OIDC_PROVIDER, AUTH_PROVIDER],
})
export class AuthModule {}
