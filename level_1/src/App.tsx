import { LoginForm } from './login-form/LoginForm'
import { useAuth } from './providers/useAuth'
import './App.css'

function App() {
  const {user, logoutUser} = useAuth()

  return (
    <>
      {user 
        ? (
            <div>
              <h1>Ты в системе!</h1>
              <button onClick={() => logoutUser()}>Выйти</button>
            </div>
          )
        : (<LoginForm />)
      }


    </>
  )
}

export default App
