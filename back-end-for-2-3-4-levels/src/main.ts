import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// АДРЕС/api
	app.setGlobalPrefix('api')
	// настройка для серверных кук
	app.use(cookieParser())
	//
	app.enableCors({
		// клиентсткий домен
		origin: ['http://localhost:3000'],
		// всегда крепиим куки к запросу
		credentials: true,
		exposedHeaders: 'set-cookie',
	})

	await app.listen(4200)
}
bootstrap()
