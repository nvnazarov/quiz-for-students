import { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { apiUrl } from '../config.js';
import { Link, Navigate } from 'react-router-dom';


const RegisterPage = () => {
    const [token, setToken] = useContext(UserContext);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [formInfo, setFormInfo] = useState({
        hint: null,
        isSended: false
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        if (form.name === '') {
            setFormInfo({ hint: 'Укажите имя' });
            e.target[0].focus();
            return;
        }

        if (form.email === '') {
            setFormInfo({ hint: 'Укажите почту' });
            e.target[1].focus();
            return;
        }

        if (form.password === '') {
            setFormInfo({ hint: 'Укажите пароль' });
            e.target[2].focus();
            return;
        }

        setFormInfo({ isSended: true, hint: null });

        let token = await fetch(
            `${apiUrl}/users/register`,
            {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password
                })
            })
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            if (response.status === 400) {
                setFormInfo({ isSended: false, hint: 'Почта уже используется' });
            }

            return null;
        })
        .catch(error => {
            setFormInfo({ isSended: false, hint: 'Попробуйте в другой раз' });
            return null;
        })

        if (token) {
            setToken(token);
        }
    }

    if (token) {
        return <Navigate to='/profile'/>;
    }

    return (
        <>
            <form onSubmit={ onSubmit }>
                <input name='name' type='text' placeholder='Имя' value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />

                <input name='email' type='text' placeholder='Почта' value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />

                <input name='password' type='password' placeholder='Пароль' value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />

                <button name='submit' type='submit' disabled={formInfo.isSended}>Создать</button>

                { formInfo.hint && <span className='err'>{formInfo.hint}</span> }
            </form>

            <hr/>

            <Link to='/login'>Войти</Link>
        </>
    )
}

export default RegisterPage;