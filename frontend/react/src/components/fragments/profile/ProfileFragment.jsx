import TextField from "../../ui/TextField";
import SubmitButton from "../../ui/SubmitButton";
import KeyValue from "../../ui/KeyValue";
import { useState } from "react";


const ProfileFragment = ({ userName, userEmail, onUpdateUserName }) => {
    const [newUserName, setNewUserName] = useState("");

    return (
        <div className="Page">
            <h1>Профиль</h1>

            <div className="Vertical GapSmall NameEmailBox">
                <KeyValue name="Имя" value={ userName ? userName : "..." } />
                <KeyValue name="Почта" value={ userEmail ? userEmail : "..." } />
            </div>

            <form className="Horizontal GapSmall" onSubmit={ () => onUpdateUserName(newUserName) }>
                <TextField placeholder="Введите новое имя" text={ newUserName } setText={ setNewUserName } />
                <SubmitButton title="Обновить" />
            </form>
        </div>
    );
};


export default ProfileFragment;