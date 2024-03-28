import { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link, Navigate } from 'react-router-dom';
import { register } from '../api/User.js';
import SubmitButton from '../components/ui/SubmitButton';
import TextField from '../components/ui/TextField';
import PasswordField from '../components/ui/PasswordField';
import Notification from '../components/ui/Notification';


const RegisterPage = () => {
    const [token, setToken] = useContext(UserContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formInfo, setFormInfo] = useState({
        hint: null,
        isSended: false
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        setFormInfo({isSended: true, hint: null});
        const response = await register({name, email, password});
        if (response.token) {
            setToken(response.token);
        } else {
            setFormInfo({isSended: false, hint: response.hint});
        }
    }

    if (token) {
        return <Navigate to='/me/profile'/>;
    }

    return (
        <>
            <form className='Centered Box' onSubmit={onSubmit}>
                <div className='List Mid'>
                    <h1>Регистрация</h1>

                    <TextField name='name' placeholder='Имя' text={name} setText={setName} />
                    <TextField name='email' placeholder='Почта' text={email} setText={setEmail} />
                    <PasswordField name='password' placeholder='Пароль' text={password} setText={setPassword} />
                    <div>
                        <SubmitButton isLoading={formInfo.isSended} title='Создать' />
                    </div>
                    <hr/>
                    <Link to="/login">Войти в аккаунт</Link>
                </div>
            </form>

            {
                formInfo.hint && <Notification message={formInfo.hint} />
            }
        </>
    )
}


export default RegisterPage;