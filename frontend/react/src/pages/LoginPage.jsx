import { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link, Navigate } from 'react-router-dom';
import { login } from '../api/User'; 
import SubmitButton from '../components/ui/SubmitButton';
import TextField from '../components/ui/TextField';
import PasswordField from '../components/ui/PasswordField';
import Notification from '../components/ui/Notification';


const LoginPage = () => {
    const [token, setToken] = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formInfo, setFormInfo] = useState({
        hint: null,
        isSended: false
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        setFormInfo({isSended: true, hint: null});
        const response = await login({email, password});
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
                    <h1>Авторизация</h1>
                    <TextField placeholder='Почта' text={email} setText={setEmail} />
                    <PasswordField placeholder='Пароль' text={password} setText={setPassword} />
                    <div>
                        <SubmitButton isLoading={formInfo.isSended} title={'Войти'} />
                    </div>
                    <hr/>
                    <Link to="/register">Создать аккаунт</Link>
                </div>
            </form>

            {
                formInfo.hint && <Notification message={formInfo.hint} />
            }
        </>
    );
}


export default LoginPage;