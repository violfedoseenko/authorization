import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

// кастомный декоратор для добавления нужного Guard
export const Auth = (role: Role = Role.USER) => {
	if (role === Role.ADMIN) {
		return applyDecorators(UseGuards(JwtAuthGuard, OnlyAdminGuard))
	}

	return applyDecorators(UseGuards(JwtAuthGuard))
}
