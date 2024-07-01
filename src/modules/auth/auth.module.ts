import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import {
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
} from '@modules/auth/zitadel.module-definition';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ZitadelIntrospectionOptions } from 'passport-zitadel';
import AppConfig from '@modules/auth/config/app.config';
import ZitadelConfig from '@modules/auth/config/zitadel.config';

@Module({
	imports: [
		PassportModule,
		ConfigModule.forRoot({
			load: [ZitadelConfig, AppConfig],
			ignoreEnvFile: true,
			cache: true,
			isGlobal: true,
			validationOptions: {
				abortEarly: true,
			},
		}),
		AuthModule.forRootAsync({
			inject: [ConfigService],
			imports: [ConfigModule],
			useFactory: (config: ConfigService): ZitadelIntrospectionOptions => {
				return {
					authority: config.getOrThrow<string>('ZITADEL.IDP_AUTHORITY'),
					authorization: {
						type: config.getOrThrow<'jwt-profile'>(
							'ZITADEL.IDP_AUTHORIZATION_TYPE',
						),
						profile: {
							key: config.getOrThrow<string>(
								'ZITADEL.IDP_AUTHORIZATION_PROFILE_KEY',
							),
							appId: config.getOrThrow<string>(
								'ZITADEL.IDP_AUTHORIZATION_PROFILE_APP_ID',
							),
							keyId: config.getOrThrow<string>(
								'ZITADEL.IDP_AUTHORIZATION_PROFILE_KEY_ID',
							),
							type: config.getOrThrow<'application'>(
								'ZITADEL.IDP_AUTHORIZATION_PROFILE_TYPE',
							),
							clientId: config.getOrThrow<string>(
								'ZITADEL.IDP_AUTHORIZATION_PROFILE_CLIENT_ID',
							),
						},
					},
				};
			},
		}),
	],
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
