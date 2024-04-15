import { useState, useContext } from "react";

import { UserContext } from "../../../contexts/UserContext";
import { NotificationContext } from "../../../contexts/NotificationContext";
import { useInvites } from "../../../hooks/hooks";
import { joinByInvite, cancelInvite } from "../../../api/group";
import Button from "../../Button";
import Loader from "../../Loader";
import "../../../styles/common.css";


const InvitesFragment = () => {
    const notificationService = useContext(NotificationContext);
    const [authToken] = useContext(UserContext);
    const [invites, setInvites, loadInvites] = useInvites(authToken);
    const [loading, setLoading] = useState(false); 

    if (invites === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Приглашения</h1>
                
                <div className="mg-v-md">
                    <Loader />
                </div>
            </div>
        );
    }

    if (invites === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Приглашения</h1>
                
                <p className="mg-v-md">Не удалось загрузить приглашения.</p>
            </div>
        );
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);
        await loadInvites();
        setLoading(false);
    };

    const inviteMapper = (invite) => {
        const onJoin = async () => {
            const response = await joinByInvite({ authToken, inviteId: invite.id });

            if (response !== undefined && response.ok) {
                notificationService.addNotification("Успешно.");
                loadInvites();
            } else {
                notificationService.addNotification("Не удалось присоединиться к группе.");
            }
        };

        const onCancel = async () => {
            const response = await cancelInvite({ authToken, inviteId: invite.id });

            if (response !== undefined && response.ok) {
                loadInvites();
            } else {
                notificationService.addNotification("Не удалось отклонить приглашение.");
            }
        };

        return (
            <div key={ invite.id } className="bg-white sh r-md p-md ta-center">
                <div>{ invite.group_name }</div>
                <div className="h gap-md mg-t-md">
                    <button className="btn-sm" onClick={ onJoin }>Присоединиться</button>
                    <button className="btn-sm" onClick={ onCancel }>Отклонить</button>
                </div>
            </div>
        );
    };
    const invitesElements = invites.map(inviteMapper);

    return (
        <div className="h-full bg-white p-lg">
            <h1>Приглашения</h1>

            <form className="mg-v-md" onSubmit={ onSubmit }>
                <Button loading={ loading }>Обновить</Button>
            </form>

            <div className="h gap-md wrap">
                { invitesElements.length === 0 ? <p>У вас нет приглашений.</p> : invitesElements }
            </div>
        </div>  
    );
};


export default InvitesFragment;