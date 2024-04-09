import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { Route, redirect, Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
    const [token,] = useContext(UserContext);

    if (!token) {
        return <Navigate to="/login" />;
    }

    console.log(children);

    return children;
};


export default PrivateRoute;