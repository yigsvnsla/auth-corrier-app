import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.dev.env',
			// load: [configurations]
			// validationSchema: schema
			isGlobal: true,
			// ignoreEnvFile: boolean
			// ignoreEnvVars: boolean
		}),
		AuthModule,
	],
})
export class AppModule {}
