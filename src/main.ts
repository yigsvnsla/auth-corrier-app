/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import helmet, { HelmetOptions } from 'helmet';
import * as fs from 'fs';
import * as path from 'path';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
	DocumentBuilder,
	SwaggerCustomOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import {
	CorsOptions,
	CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import {
	ClassSerializerInterceptor,
	Logger,
	NestApplicationOptions,
	ValidationPipe,
	ValidationPipeOptions,
	VersioningType,
} from '@nestjs/common';

async function bootstrap() {
	const globalPrefix: string = '/api';
	const scopes: string[] = ['openid', 'profile', 'email', 'offline_access'];
	const helmetOptions: HelmetOptions = {};
	const corsOptions: CorsOptions | CorsOptionsDelegate<Express.Request> = {};
	const appOptions: NestApplicationOptions = {
		logger: ['error', 'warn', 'debug', 'log'],
	};
	const validationOptions: ValidationPipeOptions = {
		transform: true,
		always: true,
		forbidUnknownValues: true,
	};
	const app = await NestFactory.create(AppModule, appOptions);

	app.use(helmet(helmetOptions));
	app.useGlobalPipes(new ValidationPipe(validationOptions));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.enableCors(corsOptions);
	app.enableVersioning({ type: VersioningType.URI });
	app.setGlobalPrefix(globalPrefix);

	const config: ConfigService = app.get(ConfigService);

	const port: number = config.getOrThrow<number>('APP_PORT');
	const clientId: string = config.getOrThrow<string>('OPENAPI_CLIENT_ID');
	const authority: string = config.getOrThrow<string>('IDP_AUTHORITY');
	const isProduction: boolean = config.get<string>('NODE_ENV') !== 'production';
	const clientSecret: string = config.getOrThrow<string>(
		'OPENAPI_CLIENT_SECRET',
	);

	const redirectUri = isProduction
		? `http://localhost:${port}`
		: `http://localhost:${port}`;

	const swaggerSetupModule: SwaggerCustomOptions = {
		swaggerOptions: {
			persistAuthorization: true,
			oauth2RedirectUrl: `${redirectUri}${globalPrefix}/oauth2-redirect.html`,
			initOAuth: { clientId, clientSecret, scopes },
		},
	};

	// ! FIXME json import assertions in the future
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	// console.log(await import(path.join('..', 'package.json')));

	// const pJson = await import(path.join('..', 'package.json'));
	const swaggerDocument = new DocumentBuilder()
		.setTitle('Zitadel NestJs Example')
		.setTermsOfService('http://swagger.io/terms/')
		.setExternalDoc('Find out more about Swagger', 'http://swagger.io/')
		.setContact('Contact the developer', '', 'mail@example.com')
		.setLicense('Apache 2.0', 'http://www.apache.org/licenses/LICENSE-2.0.html')
		.setVersion('1.0.2')

		// .setVersion(pJson.version)
		// * Authentication security by token introspection
		.addSecurity('zitadel-jwt', {
			type: 'openIdConnect',
			name: 'Zitadel',
			openIdConnectUrl: `${authority}/.well-known/openid-configuration`,
		});

	const document = SwaggerModule.createDocument(app, swaggerDocument.build());
	SwaggerModule.setup(globalPrefix.slice(1), app, document, swaggerSetupModule);
	if (isProduction)
		fs.writeFileSync(
			path.join(__dirname, '..', 'swagger.json'),
			JSON.stringify(document),
		);
	await app.listen(port);
	Logger.log(`Server Running on port ${port}`, 'NestApplication');
}

bootstrap();
