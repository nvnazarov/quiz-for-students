import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { registerUser } from "../api/user.js";
import { NotificationContext } from "../contexts/NotificationContext";
import Button from "../components/Button";
import TextField from "../components/TextField";


const RegisterPage = () => {
    const notificationService = useContext(NotificationContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        if (name === "") {
            notificationService.addNotification("Укажите имя.");
            return;
        }

        if (name.length > 100) {
            notificationService.addNotification("Имя слишком длинное.");
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
        const response = await registerUser({ name, email, password });
        setLoading(false);
        
        if (response === undefined) {
            notificationService.addNotification("Попробуйте в другой раз.");
            return;
        }

        if (response.ok) {
            notificationService.addNotification("На почту отправлена ссылка. Перейдите по ней для активации аккаунта.");
        } else if (response.status === 400) {
            notificationService.addNotification("Пароль должен содержать не менее 8 символов, включая цифры и буквы.");
        } else if (response.status === 409) {
            notificationService.addNotification("Аккаунт с этой почтой существует.");
        }
    }

    return (
        <form className="Centered box r-lg p-lg w-md" onSubmit={ onSubmit }>
            <div className="v gap-md ta-center">
                <h1>Регистрация</h1>
                <p className="ta-center mg-md">
                    Создайте аккаунт, указав имя, почту и пароль.
                    Если у вас уже есть аккаунт, вы можете авторизоваться <Link to="/login">здесь</Link>.
                </p>
                <TextField placeholder="Имя" text={ name } setText={ setName } />
                <TextField placeholder="Почта" text={ email } setText={ setEmail } />
                <TextField placeholder="Пароль" type="password" text={ password } setText={ setPassword } />
                <Button loading={ loading }>Создать</Button>
            </div>
        </form>
    );
};


export default RegisterPage;