export interface CredentialsDTO {
	access_token: string;
	expires_at: number;
	refresh_expires_in: number;
	refresh_token: string;
	token_type: string;
	id_token: string;
	'not-before-policy': number;
	session_state: string;
	scope: string;
}
