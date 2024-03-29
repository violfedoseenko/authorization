export interface IUser {
	email: string
	name: string
	$id: string
}

export interface IAuthContext {
	user: IUser | null

    //функция, которая может использоваться в форме
    //туда можно передать данные пользователя и онбудеь залогинен/ зарегистрирован в системе
	authUser: (
		email: string,
		password: string,
		isRegister: boolean
	) => Promise<void>
	logoutUser: () => Promise<void>
}
