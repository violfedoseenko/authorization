import { AuthGuard } from '@nestjs/passport'
// проверка по умолчанию что челлвек находится в системе
export class JwtAuthGuard extends AuthGuard('jwt') {}
