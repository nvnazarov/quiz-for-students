import { useContext, useState } from "react";

import { UserContext } from "../../../contexts/UserContext";
import { useUser } from "../../../hooks/hooks";
import { updateUser } from "../../../api/user";
import { NotificationContext } from "../../../contexts/NotificationContext";
import TextField from "../../TextField";
import Button from "../../Button";
import Loader from "../../Loader";
import "../../../styles/common.css";


const ProfileFragment = () => {
    const [authToken] = useContext(UserContext);
    const notificationService = useContext(NotificationContext);
    const [newUserName, setNewUserName] = useState("");
    const [user, setUser] = useUser(authToken);
    const [loading, setLoading] = useState(false);

    if (user === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Профиль</h1>
                
                <div className="mg-v-md">
                    <Loader />
                </div>
            </div>
        );
    }

    if (user === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Профиль</h1>
                
                <p className="mg-v-md">Не удалось загрузить профиль.</p>
            </div>
        );
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading || newUserName === user.name) {
            return;
        }

        setLoading(true);
        const data = {
            authToken,
            name: newUserName,
        };
        const response = await updateUser(data);
        setLoading(false);
        
        if (response !== undefined && response.ok) {
            setUser({ ...user, name: data.name });
        } else {
            notificationService.addNotification("Не удалось обновить имя пользователя.");
        }
    };

    return (
        <div className="h-full bg-white p-lg">
            <h1>Профиль</h1>

            <div className="mg-v-md">
                { user.name === "" ? "[Имя не указано]" : user.name }
                <p>{ user.email }</p>
            </div>

            <form className="h gap-md" onSubmit={ onSubmit }>
                <TextField placeholder="Введите новое имя" text={ newUserName } setText={ setNewUserName } />
                <Button loading={ loading }>Сохранить</Button>
            </form>
        </div>
    );
};


export default ProfileFragment;