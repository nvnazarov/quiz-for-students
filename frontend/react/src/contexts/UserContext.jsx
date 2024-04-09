import { createContext, useEffect, useState } from "react";
import { getUser } from "../api/user";
import { Navigate } from "react-router-dom";

const UserContext = createContext([null, null]);

const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(undefined);

    const setAndStoreToken = (token) => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
        setToken(token);
    };

    useEffect(() => {
        const checkToken = async () => {
            const savedToken = localStorage.getItem("token");
            const data = {
                authToken: savedToken,
            };
            const response = await getUser(data);

            if (response === undefined || !response.ok) {
                setAndStoreToken(null);
            } else {
                setAndStoreToken(savedToken);
            }
        };

        checkToken();
    }, []);

    if (token === undefined) {
        return (
            <>
                Loading
            </>
        );
    }

    return (
        <UserContext.Provider value={[token, setAndStoreToken]}>
            { children }
        </UserContext.Provider>
    );
};


export {
    UserContext,
    UserContextProvider,
};