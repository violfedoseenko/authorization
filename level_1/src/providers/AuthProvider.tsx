import { ID } from 'appwrite'
import {
	FC,
	PropsWithChildren,
	createContext,
	useEffect,
	useState,
} from 'react'
import { account } from '../appwrite'
import { IAuthContext, IUser } from './auth.types'

export const AuthContext = createContext<IAuthContext>({
	authUser: async () => {},
	logoutUser: async () => {},
	user: null,
})

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [user, setUser] = useState<IUser | null>(null)

	const authUser = async (
		email: string,
		password: string,
		isRegister = false
	) => {
		try {
            // если регистрация - создаем аккаунт
			if (isRegister) {
				await account.create(ID.unique(), email, password)
			}

            //создаем сессию
			await account.createEmailPasswordSession(email, password)

			setUser(await account.get())
            //один из вариантов переадресании на нужную страницу.Но удобнее react router использовать
			//  window.history.pushState({}, '', '/')
		} catch (error) {
			console.log(error)
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		checkUserStatus()
	}, [])

    // получаем актуального юзера. Функция должна исполняться при первой загрузке сайта
	const checkUserStatus = async () => {
		try {
			setUser(await account.get())
		} catch (error) {
			setUser(null)
		} finally {
			setIsLoading(false)
		}
	}

	const logoutUser = async () => {
		await account.deleteSession('current')
		setUser(null)
		setIsLoading(false)
	}

	const contextData: IAuthContext = {
		user,
		authUser,
		logoutUser,
	}

	return (
		<AuthContext.Provider value={contextData}>
			{isLoading ? <p>Загрузка...</p> : children}
		</AuthContext.Provider>
	)
}
