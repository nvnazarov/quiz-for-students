import { createContext, useEffect, useState } from "react";
import { getUser } from "../api/user";

const UserContext = createContext([null, null]);

const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));

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
            const data = {
                authToken: token,
            };
            const response = await getUser(data);

            if (response === undefined || !response.ok) {
                setAndStoreToken(null);
            }
        };

        checkToken();
    }, []);

    return (
        <UserContext.Provider value={[token, setAndStoreToken]}>
            {children}
        </UserContext.Provider>
    );
};


export {
    UserContext,
    UserContextProvider,
};