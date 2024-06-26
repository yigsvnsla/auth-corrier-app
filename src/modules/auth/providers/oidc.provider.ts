import { Provider } from '@nestjs/common';
import { Issuer } from 'openid-client';
import { ConfigService } from '@nestjs/config';
import { OIDC_PROVIDER_TOKEN } from 'src/modules/auth/constants/tokens';

export const OIDC_PROVIDER: Provider = {
	inject: [ConfigService],
	provide: OIDC_PROVIDER_TOKEN,
	useFactory: async (configService: ConfigService) => {
		const issuer = configService.getOrThrow<string>('KC_ISSUER');
		const client_id = configService.getOrThrow<string>('APP_CLIENT_ID');
		const client_secret = configService.getOrThrow<string>('APP_CLIENT_SECRET');
		const { Client } = await Issuer.discover(issuer);

		return new Client({ client_id, client_secret });
	},
};
