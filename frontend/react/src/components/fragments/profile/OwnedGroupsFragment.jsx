import TextField from "../../ui/TextField";
import SubmitButton from "../../ui/SubmitButton";
import { useState } from "react";
import { Link } from "react-router-dom";


const OwnedGroupsFragment = ({ groups, onCreateNewGroup }) => {
    const [newGroupName, setNewGroupName] = useState("");

    const groupMapper = (group) => (
        <Link to={ `/groups/my/${group.id}` } key={group.id} className="Card">
            { group.name }
        </Link>
    );

    const groupsElements = groups === undefined ? <>Не удалось загрузить группы</> :
                            groups.length === 0 ? <>Вы еще не создавали группы</> :
                            groups.map(groupMapper);

    return (
        <div className="Page">
            <h1>Мои группы</h1>

            <form className="Horizontal VerticalMargin GapSmall" onSubmit={ (e) => { e.preventDefault(); onCreateNewGroup(newGroupName) } }>
                <TextField placeholder="Введите название группы" text={ newGroupName } setText={ setNewGroupName } />
                <SubmitButton title="Создать" />
            </form>

            <div className="Grid">
                { groupsElements }
            </div>
        </div>
    );
};


export default OwnedGroupsFragment;