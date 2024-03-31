import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role, User } from '@prisma/client'
import { Request } from 'express'

export class OnlyAdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	// получает текущий контекст, в котором находимся и из контекста достаем request
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>()
		const user = request.user as User

		//получаем роль из призмы
		if (user.role !== Role.ADMIN) {
			throw new ForbiddenException('У тебя нет прав!')
		}

		return true
	}
}
