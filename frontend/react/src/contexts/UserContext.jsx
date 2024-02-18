import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'))

    const setAndStoreToken = (token) => {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
        
        setToken(token)
    }

    return (
        <UserContext.Provider value={[token, setAndStoreToken]}>
            {children}
        </UserContext.Provider>
    );
}