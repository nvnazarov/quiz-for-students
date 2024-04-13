import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { authUser } from "../api/user";
import { NotificationContext } from "../contexts/NotificationContext";
import Button from "../components/Button";
import TextField from "../components/TextField";
import "../styles/common.css";


const LoginPage = () => {
    const notificationService = useContext(NotificationContext);
    const [token, setToken] = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        if (email === "") {
            notificationService.addNotification("Укажите почту.");
            return;
        }

        if (password === "") {
            notificationService.addNotification("Укажите пароль.");
            return;
        }

        setLoading(true);
        const response = await authUser({ email, password });
        setLoading(false);

        if (response === undefined) {
            notificationService.addNotification("Попробуйте в другой раз.");
            return;
        }

        if (response.ok) {
            const authToken = await response.json(); 
            setToken(authToken);
        } else {
            notificationService.addNotification("Пароль или почта неверны.");
        }
    }

    if (token) {
        return <Navigate to="/profile" />;
    }

    return (
        <form className="center box r-lg p-lg w-md" onSubmit={ onSubmit }>
            <div className="v gap-md ta-center">
                <h1>Авторизация</h1>
                <p className="mg-md">
                    Войдите в свой аккаунт, указав почту и пароль.
                    Если у вас еще нет аккаунта, создайте его <Link to="/register">здесь</Link>.
                </p>
                <TextField placeholder="Почта" text={ email } setText={ setEmail } />
                <TextField placeholder="Пароль" type="password" text={ password } setText={ setPassword } />
                <Button loading={ loading }>Войти</Button>
            </div>
        </form>
    );
};


export default LoginPage;