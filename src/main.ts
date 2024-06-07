import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
// import { Issuer, Strategy } from 'openid-client';
import * as session from 'express-session';
// import * as passport from 'passport';

async function bootstrap() {
	const logger = new Logger('NestBoostrap');
	// const url_issure = 'http://localhost:8080/realms/auth-nestjs';
	// const issuer = await Issuer.discover(url_issure);
	// const client = new issuer.Client({
	// 	client_id: 'nestjs-app',
	// 	client_secret: 'MGuws0NYlyOh6pnbDeCHbDM2GlRdN2iY',
	// });

	// const params =  {
	//   redirect_uri: process.env.APP_AUTH_REDIRECT_URI,
	//   scope: process.env.APP_AUTH_SCOPES,
	// }

	// // Obtener el tiempo actual en formato UNIX (segundos desde 1970-01-01)
	// const created_at = Math.floor(Date.now() / 1000);

	// const expires_at = Math.floor((Date.now() + (3600 - 72) * 1000) / 1000);

	// const callBackStrategy = (tokenset:any, userinfo:any, done:any)=> done(null, { ...userinfo, ...tokenset,expires_at ,created_at});
	// const strategy = new Strategy({client,params,passReqToCallback: false, usePKCE: false }, callBackStrategy)

	// passport.use('oidc',strategy)
	// console.log(issuer, client);

	const app = await NestFactory.create(AppModule);

	app.enableCors();
	// app.use(passport.initialize());
	// app.use(passport.session());
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
