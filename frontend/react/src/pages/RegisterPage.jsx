import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/user.js";
import SubmitButton from "../components/ui/SubmitButton";
import TextField from "../components/ui/TextField";
import PasswordField from "../components/ui/PasswordField";
import Notification from "../components/ui/Notification";


const RegisterPage = () => {
    const [name, setName] = useState("");
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

        if (name === "") {
            setFormInfo({ ok: false, isSended: true, hint: "Укажите имя." });
            return;
        }

        if (name.length > 100) {
            setFormInfo({ ok: false, isSended: true, hint: "Имя слишком длинное." });
            return;
        }

        if (email === "") {
            setFormInfo({ ok: false, isSended: true, hint: "Укажите почту." });
            return;
        }

        if (password === "") {
            setFormInfo({ ok: false, isSended: true, hint: "Укажите пароль." });
            return;
        }

        setFormInfo({ ok: false, isSended: true, hint: null });
        const response = await registerUser({ name, email, password });
        
        if (response === undefined) {
            setFormInfo({ ok: false, isSended: false, hint: "Попробуйте в другой раз." });
            return;
        }

        if (response.ok) {
            setFormInfo(
                {
                    ok: true,
                    isSended: false,
                    hint: "На почту отправлена ссылка. Перейдите по ней для активации аккаунта."
                }
            );
        } else if (response.status === 400) {
            setFormInfo(
                {
                    ok: false,
                    isSended: false,
                    hint: "Пароль должен содержать не менее 8 символов, включая цифры и буквы."
                }
            );
        } else if (response.status === 409) {
            setFormInfo(
                {
                    ok: false,
                    isSended: false,
                    hint: "Аккаунт с этой почтой существует."
                }
            );
        }
    }

    return (
        <>
            <form className="Centered Box" onSubmit={onSubmit}>
                <div className="List Mid">
                    <h1>Регистрация</h1>

                    <TextField placeholder="Имя" text={ name } setText={ setName } />
                    <TextField placeholder="Почта" text={ email } setText={ setEmail } />
                    <PasswordField placeholder="Пароль" text={ password } setText={ setPassword } />
                    <div>
                        <SubmitButton isLoading={ formInfo.isSended } title="Создать" />
                    </div>
                    <hr/>
                    <Link to="/login">Войти в аккаунт</Link>
                </div>
            </form>

            {
                formInfo.hint && <Notification message={ formInfo.hint } isError={ !(formInfo.ok) } />
            }
        </>
    )
}


export default RegisterPage;