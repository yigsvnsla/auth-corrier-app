import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { ODIC_PROVIDER } from './middlewares/OIDC.provider';

@Module({
	imports: [
		PassportModule.register({ session: true, defaultStrategy: 'StrategyOIDC' }),
	],
	controllers: [AuthController],
	providers: [AuthService, ODIC_PROVIDER],
	exports: [],
})
export class AuthModule {}
