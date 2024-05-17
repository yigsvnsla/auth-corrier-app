import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AppService } from '../app.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy) {
	constructor(private appService: AppService) {
		super();
	}
}
