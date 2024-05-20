import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AppService } from '../app.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy) {
	constructor(private appService: AppService) {
		super({
			authorizationURL: 'https://www.example.com/oauth2/authorize',
			tokenURL: 'https://www.example.com/oauth2/token',
			clientID: 'nestjs-app',
			clientSecret: 'MGuws0NYlyOh6pnbDeCHbDM2GlRdN2iY',
			callbackURL: 'http://localhost:3000/auth/example/callback',
		});
	}
}
