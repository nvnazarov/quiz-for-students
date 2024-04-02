import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, Navigate } from "react-router-dom";
import { authUser } from "../api/user"; 
import SubmitButton from "../components/ui/SubmitButton";
import TextField from "../components/ui/TextField";
import PasswordField from "../components/ui/PasswordField";
import Notification from "../components/ui/Notification";


const LoginPage = () => {
    const [token, setToken] = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formInfo, setFormInfo] = useState(
        {
            ok: false,
            hint: null,
            isSended: false
        }
    );

    const onSubmit = async (e) => {
        e.preventDefault();

        setFormInfo({ ok: false, isSended: true, hint: null });
        await new Promise((resolve) => resolve(undefined));

        if (email === "") {
            setFormInfo({ ok: false, isSended: true, hint: "Укажите почту." });
            return;
        }

        if (password === "") {
            setFormInfo({ ok: false, isSended: true, hint: "Укажите пароль." });
            return;
        }


        const response = await authUser({ email, password });

        if (response === undefined) {
            setFormInfo({ ok: false, isSended: false, hint: "Попробуйте в другой раз" });
            return;
        }

        if (response.ok) {
            const authToken = await response.json(); 
            setToken(authToken);
        } else {
            setFormInfo({ ok: false, isSended: false, hint: "Пароль или почта неверны" });
        }
    }

    if (token) {
        return <Navigate to="/profile" />;
    }

    return (
        <>
            <form className="Centered Box" onSubmit={ onSubmit }>
                <div className="List Mid">
                    <h1>Авторизация</h1>
                    <TextField placeholder="Почта" text={ email } setText={ setEmail } />
                    <PasswordField placeholder="Пароль" text={ password } setText={ setPassword } />
                    <div>
                        <SubmitButton isLoading={ formInfo.isSended } title="Войти" />
                    </div>
                    <hr/>
                    <Link to="/register">Создать аккаунт</Link>
                </div>
            </form>

            {
                formInfo.hint && <Notification message={ formInfo.hint } isError={ !(formInfo.ok) } />
            }
        </>
    );
}


export default LoginPage;