import { IsEmail, IsString, MinLength } from 'class-validator'

// класс в котором описываются входящие данные
export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	password: string
}
