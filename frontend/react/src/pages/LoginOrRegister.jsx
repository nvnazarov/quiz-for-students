import { useState } from 'react'
import Login from '../components/Login.jsx'
import Register from '../components/Register.jsx'

const LoginOrRegister = () => {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className='box ctr'>
            { isLogin ? <Login /> : <Register /> }
            <span className='alt' onClick={ () => setIsLogin(!isLogin) }>
                { isLogin ? 'Нет аккаунта? Создать' : 'Есть аккаунт? Войти' }
            </span>
        </div>
    )
}

export default LoginOrRegister