import { apiUrl } from '../config';


const login = async (form) => {
    if (form.email === '') {
        return {token: null, hint: 'Укажите почту'};
    }

    if (form.password === '') {
        return {token: null, hint: 'Укажите пароль'};
    }

    const requestParams = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(form),
    };

    const response = await fetch(`${apiUrl}/users/login`, requestParams).catch(() => {});

    if (response === undefined || response.status >= 500) {
        return {token: null, hint: 'Попробуйте в другой раз'};
    }

    if (response.status === 400) {
        return {token: null, hint: 'Пароль или почта неверны'};
    }
    
    const token = await response.json();
    return {token: token, hint: null};
}


const register = async (form) => {
    if (form.name === '') {
        return {token: null, hint: 'Укажите имя'};
    }

    if (form.email === '') {
        return {token: null, hint: 'Укажите почту'};
    }

    if (form.password === '') {
        return {token: null, hint: 'Укажите пароль'};
    }

    const requestParams = {
        method: 'POST',
        headers: {
            "content-type": 'application/json',
        },
        body: JSON.stringify(form),
    };

    const response = await fetch(`${apiUrl}/users/register`, requestParams).catch(() => {});
    
    if (response === undefined || response.status >= 500) {
        return {token: null, hint: 'Попробуйте в другой раз'};
    }

    if (response.status === 400) {
        return {token: null, hint: 'Пароль недостаточно сложный'};
    }

    if (response.status === 409) {
        return {token: null, hint: 'Почта уже используется'};
    }

    const token = await response.json();
    return {token: token, hint: null};
}


export {
    login,
    register,
}