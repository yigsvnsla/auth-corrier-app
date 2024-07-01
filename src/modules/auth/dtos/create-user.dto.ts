export class CreateUserDto {
	email: string;
	password: string;
	// roles: RoleEnum[] = [];
	isEnabled?: boolean = true;
}
