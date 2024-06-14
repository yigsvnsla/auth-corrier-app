import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
	const logger = new Logger('NestBoostrap');

	const app = await NestFactory.create(AppModule);

	app.enableCors();
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
