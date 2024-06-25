import { SingInCredentialsDTO } from '../../common/interfaces/dtos/sing-in.dto';
import { UserDTO } from '../../common/interfaces/user.interface';
import { AuthService } from '../../common/interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants/tokens';
import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { SingUpCredentialsDto } from 'src/common/interfaces/dtos/sing-up.dto';

@Controller({
	path: ['auth'],
	version: '1',
})
export class AuthController {
	constructor(
		@Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
	) {}

	@Public()
	@Post('sing-up')
	findOne(@Body() body: SingUpCredentialsDto) {
		return this.authService.register(body);
	}

	@Public()
	@Post('sing-in')
	@HttpCode(HttpStatus.OK)
	public async SingIn(
		@Body() credentials: SingInCredentialsDTO,
	): Promise<UserDTO> {
		return await this.authService.login(credentials);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async findAll(@Headers('authorization') t: string) {
		return await this.authService.userInfo(t.replace(/Bearer /, '').trim());
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
	//   return this.authService.update(+id, updateAuthDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.authService.remove(+id);
	// }
}

// curl "http://localhost:8080/realms/auth-nestjs/login-actions/registration?session_code=16e2eaHMzfpA-DKDYv3LAm8et4vvPdIVq3XRsiICt6U&execution=d9a8e4b9-e9c4-4c2d-babe-2776fca3cf74&client_id=nest-client&tab_id=Cpm157Je_rQ" ^
//   -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" ^
//   -H "Accept-Language: es-US,es-419;q=0.9,es;q=0.8" ^
//   -H "Cache-Control: no-cache" ^
//   -H "Connection: keep-alive" ^
//   -H "Content-Type: application/x-www-form-urlencoded" ^
//   -H "Cookie: AUTH_SESSION_ID=83cd0347-9539-482a-990b-2d8682e9ddec; AUTH_SESSION_ID_LEGACY=83cd0347-9539-482a-990b-2d8682e9ddec; _ga=GA1.1.1290664330.1715894639" ^
//   -H "Origin: null" ^
//   -H "Pragma: no-cache" ^
//   -H "Sec-Fetch-Dest: document" ^
//   -H "Sec-Fetch-Mode: navigate" ^
//   -H "Sec-Fetch-Site: same-origin" ^
//   -H "Sec-Fetch-User: ?1" ^
//   -H "Upgrade-Insecure-Requests: 1" ^
//   -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" ^
//   -H ^"sec-ch-ua: ^\^"Not/A)Brand^\^";v=^\^"8^\^", ^\^"Chromium^\^";v=^\^"126^\^", ^\^"Google Chrome^\^";v=^\^"126^\^"^" ^
//   -H "sec-ch-ua-mobile: ?0" ^
//   -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^" ^
//   --data-raw ^"username=foo2&password=foo2&password-confirm=foo2&email=foo2^%^40bar.mail.com&firstName=firstname&lastName=lastname^"
