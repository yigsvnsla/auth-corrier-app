import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ZitadelIntrospectionStrategy } from 'passport-zitadel';
import { MODULE_OPTIONS_TOKEN } from '@modules/auth/zitadel.module-definition';
import { ZitadelIntrospectionOptions } from 'passport-zitadel';

@Injectable()
export class ZitadelStrategy extends PassportStrategy(
	ZitadelIntrospectionStrategy,
	'zitadel',
) {
	constructor(
		@Inject(MODULE_OPTIONS_TOKEN) options: ZitadelIntrospectionOptions,
	) {
		super(options);
	}
}
