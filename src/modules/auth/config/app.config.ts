import { registerAs } from '@nestjs/config';

export default registerAs('APP', () => ({
	PORT: 8888,
	NODE_ENV: 'development',
}));
