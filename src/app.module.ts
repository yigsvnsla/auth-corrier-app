import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MessageModule } from '@modules/messages/message.module';

@Module({
	// controllers: [AppController],
	// providers: [],
	imports: [AuthModule, UsersModule, MessageModule],
})
export class AppModule {}
