import { Provider } from '@nestjs/common';
import { Issuer } from 'openid-client';
import { StrategyOIDC } from '../strategies/OIDC.strategy';

export const ODIC_PROVIDER: Provider = {
	provide: StrategyOIDC.name,
	async useFactory() {
		const { Client } = await Issuer.discover(
			'http://localhost:8080/realms/auth-nestjs',
		);
		const client = new Client({
			client_id: 'nest-client',
			client_secret: 'XSwT7oB5fcNIhxb3NPI0c2XV4FvcTJze',
			redirect_uris: ['http://localhost:3000/cb'],
			// token_endpoint_auth_method: '',
			// response_types: ['id_token'],
		});

		// const nonce = generators.nonce();
		// await client.pushedAuthorizationRequest();
		console.log(client.authorizationUrl());

		return new StrategyOIDC(client);
	},
};
