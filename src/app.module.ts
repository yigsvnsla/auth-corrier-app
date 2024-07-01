import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ZitadelIntrospectionOptions } from 'passport-zitadel';
import ZitadelConfig from '@modules/auth/config/zitadel.config';
@Module({
	// controllers: [AppController],
	providers: [
		ConfigService,
		// AppService
	],
	imports: [
		ConfigModule.forRoot({
			load: [ZitadelConfig],
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
		}),

		AuthModule,
		UsersModule,
	],
})
export class AppModule {}
