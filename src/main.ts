import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import session from 'express-session';
import helmet from 'helmet';

async function bootstrap() {
	const logger = new Logger('NestBoostrap');
	const app = await NestFactory.create(AppModule);

	app.use(helmet());
	app.enableCors();
	app.enableVersioning({
		type: VersioningType.URI,
	});
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	app.use(
		session({
			secret: 'my-secret',
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
			},
		}),
	);
	logger.log('SERVER RUN ON PORT 3000');
	await app.listen(3000);
}
bootstrap();
