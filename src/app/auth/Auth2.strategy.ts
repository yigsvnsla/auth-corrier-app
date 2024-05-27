import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Issuer } from 'openid-client';

export async function OpenidClient() {
	const url_issure = 'http://localhost:8080/realms/auth-nestjs';
	const { Client } = await Issuer.discover(url_issure);
	return new Client({
		client_id: 'nestjs-app',
		client_secret: 'MGuws0NYlyOh6pnbDeCHbDM2GlRdN2iY',
	});
}

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'iodc') {
	constructor() {
		super({
			// clientID: 'nestjs-app',
			// issuer: 'http://localhost:8080/realms/auth-nestjs',
			// authorizationURL:
			// 	'http://localhost:8080/realms/auth-nestjs/protocol/openid-connect/auth',
			// tokenURL:
			// 	'http://localhost:8080/realms/auth-nestjs/protocol/openid-connect/token',
			// userInfoURL:
			// 	'http://localhost:8080/realms/auth-nestjs/protocol/openid-connect/userinfo',
			// clientSecret: process.env['CLIENT_SECRET'],
			// callbackURL: 'http://keyclaok:8080/',
		});
	}
	// public verify(issuer: any, profile: any, cb: any) {
	// 	console.log({ issuer, profile, cb });
	// 	return cb(null, profile);
	// }
}
