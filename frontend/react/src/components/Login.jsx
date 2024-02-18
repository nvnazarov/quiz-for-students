import { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext.jsx'
import { apiUrlPrefix } from '../config.js'
import Fetching from './Fetching.jsx'

const Login = () => {
    const [, setToken] = useContext(UserContext)

    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const [formInfo, setFormInfo] = useState({
        hint: null,
        isSended: false
    })

    const onSubmit = async (e) => {
        e.preventDefault()

        if (form.email === '') {
            setFormInfo({ hint: 'Укажите почту' })
            e.target[0].focus()
            return
        }

        if (form.password === '') {
            setFormInfo({ hint: 'Укажите пароль' })
            e.target[1].focus()
            return
        }

        setFormInfo({ isSended: true, hint: null })

        let token = await fetch(
            `${apiUrlPrefix}/users/login`,
            {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            })
        .then(response => {
            if (response.ok) {
                return response.json()
            }

            if (response.status === 400) {
                setFormInfo({ isSended: false, hint: 'Пароль или почта неверны' })
            } else {
                setFormInfo({ isSended: false, hint: 'Попробуйте в другой раз' })
            }

            return null
        })
        .catch(error => {
            setFormInfo({ isSended: false, hint: 'Попробуйте в другой раз' })
            return null
        })

        if (token) {
            setToken(token)
        }
    }

    return (
        <form onSubmit={ onSubmit }>
            <input name='email' type='text' placeholder='Почта' value={ form.email }
                onChange={ (e) => setForm({ ...form, email: e.target.value }) } />

            <input name='password' type='password' placeholder='Пароль' value={ form.password }
                onChange={ (e) => setForm({ ...form, password: e.target.value }) } />

            <button name='submit' type='submit' disabled={ formInfo.isSended }>
                { formInfo.isSended ? <Fetching /> : 'Войти' }
            </button>

            { formInfo.hint && <span className='err'>{ formInfo.hint }</span> }

            <span className='alt'>Забыли пароль?</span>
        </form>
    )
}

export default Login