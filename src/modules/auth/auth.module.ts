import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from '@modules/auth/zitadel.module-definition';
@Module({
	imports: [PassportModule],
	providers: [
		{
			provide: MODULE_OPTIONS_TOKEN,
			useValue: MODULE_OPTIONS_TOKEN,
		},
	],
})
export class AuthModule extends ConfigurableModuleClass {}
