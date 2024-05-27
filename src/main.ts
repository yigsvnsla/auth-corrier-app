import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as session from 'express-session';

async function bootstrap() {
	// console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);

	// const client = new issuer.Client({
	// 	// redirect_uris: ['http://localhost:3000/cb'],
	// 	response_types: ['code'],
	// 	// id_token_signed_response_alg (default "RS256")
	// 	// token_endpoint_auth_method (default "client_secret_basic")
	// }); // => Client

	// console.log(client);
	const app = await NestFactory.create(AppModule);

	app.use(
		session({
			secret: 'my-secret',
			resave: false,
			saveUninitialized: false,
		}),
	);

	await app.listen(3000);
}
bootstrap();
