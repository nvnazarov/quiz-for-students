import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext";
import { NotificationContext } from "../../../contexts/NotificationContext";
import { useOwnedGroups } from "../../../hooks/hooks";
import { createGroup } from "../../../api/group";
import Loader from "../../Loader";
import TextField from "../../TextField";
import Button from "../../Button";
import "../../../styles/common.css";


const GroupCard = ({ group }) => {
    return (
        <Link to={ `/groups/my/${group.id}` } className="c-gray p-md r-md bg-gray w-md bounce v-center">
            { group.name }
        </Link>
    );
};


const OwnedGroupsFragment = () => {
    const notificationService = useContext(NotificationContext);
    const [authToken] = useContext(UserContext);
    const [groups, setGroups] = useOwnedGroups(authToken);
    const [newGroupName, setNewGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    if (groups === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Мои группы</h1>
                
                <div className="mg-v-md">
                    <Loader />
                </div>
            </div>
        );
    }

    if (groups === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Мои группы</h1>
                
                <p className="mg-v-md">Не удалось загрузить группы.</p>
            </div>
        );
    }

    const groupsElements = groups.map(g => <GroupCard key={ g.id } group={ g } />);
    
    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);
        const data = {
            authToken,
            name: newGroupName,
        };
        const response = await createGroup(data);
        setLoading(false);

        if (response !== undefined && response.ok) {
            const json = await response.json();
            setGroups([...groups, json]);
        } else {
            notificationService.addNotification("Не удалось создать группу.");
        }
    };

    return (
        <div className="h-full bg-white p-lg">
            <h1>Мои группы</h1>

            <form className="h mg-v-md gap-md" onSubmit={ onSubmit }>
                <TextField placeholder="Название группы" text={ newGroupName } setText={ setNewGroupName } />
                <Button loading={ loading }>Создать</Button>
            </form>

            <div className="h gap-md wrap">
                { groupsElements.length === 0 ? <p>Вы еще не создавали групп.</p> : groupsElements }
            </div>
        </div>
    );
};


export default OwnedGroupsFragment;