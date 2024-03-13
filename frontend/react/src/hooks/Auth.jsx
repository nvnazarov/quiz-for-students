import { useState } from "react";


const useAuth = (initialState) => {
    const [isAuth, setIsAuth] = useState(initialState);

    useEffect(() => {

        setIsAuth(true);

    }, []);

    return isAuth;
}