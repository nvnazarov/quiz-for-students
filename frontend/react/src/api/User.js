import { apiUrl } from "./config";


const authUser = async ({ email, password }) => {
    const body = {
        email,
        password,
    };
    const requestParams = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    };

    const response = await fetch(`${apiUrl}/users/auth`, requestParams).catch(() => undefined);
    return response;
}


const registerUser = async ({ name, email, password }) => {
    const body = {
        name,
        email,
        password,
    };
    const requestParams = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    };

    const response = await fetch(`${apiUrl}/users/register`, requestParams).catch(() => undefined);
    return response;
}


const getUser = async ({ authToken }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/users/me`, requestParams).catch(() => undefined);
    return response;
};


const updateUser = async ({ authToken, name }) => {
    const body = {
        name: name,
    };
    const requestParams = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json",
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/users/update`, requestParams).catch(() => undefined);
    return response;
};


const activateUser = async ({ activateToken }) => {
    const requestParams = {
        method: "POST",
    };
    const response = await fetch(`${apiUrl}/users/activate/${activateToken}`, requestParams).catch(() => undefined);
    return response;
};


export {
    authUser,
    registerUser,
    getUser,
    updateUser,
    activateUser,
};