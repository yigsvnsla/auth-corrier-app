import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OAuth2Strategy } from './auth/Auth2.strategy';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, OAuth2Strategy],
})
export class AppModule {}
