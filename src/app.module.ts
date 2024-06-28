/* eslint-disable prettier/prettier */
// import { ZitadelAuthModule, ZitadelAuthModuleConfig } from '@zitadel-auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
	controllers: [AppController],
  providers: [ConfigService, AppService],
	imports: [
		AuthModule,
/* 		ZitadelAuthModule.forRootAsync({
			inject: [ConfigService],
			imports: [ConfigModule],
			useFactory: (config: ConfigService): ZitadelAuthModuleConfig => {
				return {
					authority: config.getOrThrow<string>('IDP_AUTHORITY'),
					authorization: {
						type: config.getOrThrow<'jwt-profile'>('IDP_AUTHORIZATION_TYPE'),
						profile: {
							key: config.getOrThrow<string>('IDP_AUTHORIZATION_PROFILE_KEY'),
							appId: config.getOrThrow<string>(
								'IDP_AUTHORIZATION_PROFILE_APP_ID',
							),
							keyId: config.getOrThrow<string>(
								'IDP_AUTHORIZATION_PROFILE_KEY_ID',
							),
							type: config.getOrThrow<'application'>(
								'IDP_AUTHORIZATION_PROFILE_TYPE',
							),
							clientId: config.getOrThrow<string>(
								'IDP_AUTHORIZATION_PROFILE_CLIENT_ID',
							),
						},
					},
				};
			},
		}), */
		ConfigModule.forRoot({
			envFilePath: '.dev.env',
			isGlobal: true,
			validationOptions: {
				abortEarly: true,
			},
		}),
		AuthModule,
		UsersModule,
	],
})
export class AppModule {}
