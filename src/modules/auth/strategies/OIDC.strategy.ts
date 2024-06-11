import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, TokenSet, UserinfoResponse } from 'openid-client';

export class StrategyOIDC extends PassportStrategy(Strategy, 'StrategyOIDC') {
	constructor(protected _client: Client) {
		super({
			client: _client,
			passReqToCallback: false,
			usePKCE: false,
			params: {
				// redirect_uri: '*',
				// scope: process.env.AUTH_ONELOGIN_SCOPE,``
			},
		});
	}

	public async verify(tokenset: TokenSet) {
		const userinfo: UserinfoResponse = await this._client.userinfo(tokenset);
		console.log(userinfo);
	}
}
