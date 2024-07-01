import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import {
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
} from '@modules/auth/zitadel.module-definition';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
	imports: [PassportModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: MODULE_OPTIONS_TOKEN,
			useValue: MODULE_OPTIONS_TOKEN,
		},
	],
})
export class AuthModule extends ConfigurableModuleClass {}
