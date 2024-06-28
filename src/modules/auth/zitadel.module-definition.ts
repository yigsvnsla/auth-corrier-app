import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ZitadelIntrospectionOptions } from 'passport-zitadel';

// https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<ZitadelIntrospectionOptions>()
		.setClassMethodName('forRoot')
		.build();
