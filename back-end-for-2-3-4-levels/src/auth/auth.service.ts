/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@prisma/client'
//argon2 шифровальщик, чтобы палорь хранился в зашифрованном виде
import { verify } from 'argon2'
import { Response } from 'express'
import { AuthDto } from './dto/auth.dto'
import { UserService } from './user.service'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private jwt: JwtService,
		// поиск нащих юзеров
		private userService: UserService
	) {}

	// получаем данные dto
	async login(dto: AuthDto) {
		//валидируем пользователя
		const { password, ...user } = await this.validateUser(dto)
		//создаем токен
		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user,
			...tokens,
		}
	}

	async register(dto: AuthDto) {
		// провеняем есть ли уже пользователь в указанным email, чтобы не было дублирования
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) throw new BadRequestException('User already exists')

		//создаем юзера
		const { password, ...user } = await this.userService.create(dto)
		//создаем токен
		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user,
			...tokens,
		}
	}

	//функция обновления токенов
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const { password, ...user } = await this.userService.getById(result.id)

		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user,
			...tokens,
		}
	}

	private async issueTokens(userId: number, role?: Role) {
		const data = { id: userId, role }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new UnauthorizedException('Email or password invalid')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Email or password invalid')

		return user
	}

	//добавление refreshToken в сеоверные куки для большей безопасности
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresIn,
			// true if production
			secure: true,
			// lax if production
			sameSite: 'none',
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			// true if production
			secure: true,
			// lax if production
			sameSite: 'none',
		})
	}
}
