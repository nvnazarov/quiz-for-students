import KeyValue from "../../ui/KeyValue";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import TextField from "../../TextField";
import Button from "../../Button";
import { useGroupToken, useMembers } from "../../../hooks/hooks";
import { UserContext } from "../../../contexts/UserContext"
import { NotificationContext, NotificationType } from "../../../contexts/NotificationContext";
import { banGroupMember, unbanGroupMember, inviteUser } from "../../../api/group";
import Loader from "../../Loader";
import "../../../styles/common.css";


const MembersAdminFragment = () => {
    const { groupId } = useParams();
    const notificationService = useContext(NotificationContext);
    const [authToken] = useContext(UserContext);
    const [members, setMembers] = useMembers(authToken, groupId);
    const [groupToken] = useGroupToken(authToken, groupId);
    const [inviteEmail, setInviteEmail] = useState("");
    const [loading, setLoading] = useState(false);

    if (members === undefined || groupToken === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Участники</h1>

                Не удалось загрузить участников.
            </div>
        );
    }

    if (members === null || groupToken === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Участники</h1>
                <div className="mg-v-md">
                    <Loader />
                </div>                
            </div>
        );
    }

    const onBan = async (member) => {
        const data = {
            authToken,
            groupId,
            memberId: member.id,
        };
        const response = await banGroupMember(data);

        if (response !== undefined && response.ok) {
            setMembers(
                members.map(
                    m => {
                        if (m.id === member.id) {
                            return { ...m, banned: true };
                        } else {
                            return m;
                        }
                    }
                )
            );
            notificationService.addNotification("Успешно.", NotificationType.Success);
        } else {
            notificationService.addNotification("Не удалось заблокировать пользователя.");
        }
    };

    const onUnban = async (member) => {
        const data = {
            authToken,
            groupId,
            memberId: member.id,
        };
        const response = await unbanGroupMember(data);

        if (response !== undefined && response.ok) {
            setMembers(
                members.map(
                    m => {
                        if (m.id === member.id) {
                            return { ...m, banned: false };
                        } else {
                            return m;
                        }
                    }
                )
            );
            notificationService.addNotification("Успешно.", NotificationType.Success);
        } else {
            notificationService.addNotification("Не удалось разблокировать пользователя.");
        }
    };

    const onInvite = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }
        
        const data = {
            authToken,
            groupId,
            email: inviteEmail,
        };
        setLoading(true);
        const response = await inviteUser(data);
        setLoading(false);

        if (response === undefined) {
            notificationService.addNotification("Попробуйте в другой раз.");
            return;
        }

        if (!response.ok) {
            notificationService.addNotification("Не удалось пригласить пользователя. Возможно, почта некорректна.");
            return;
        }

        notificationService.addNotification("Успешно.", NotificationType.Success);
    };

    const memberMapper = (member) => {
        if (member.banned) {
            return (
                <div key={ member.id } className="bg-red sh p-md r-md ta-center v gap-sm">
                    <div>{ member.name }</div>
                    <div>{ member.email }</div>
                    <button className="btn-sm" onClick={ () => onUnban(member) }>Разблокировать</button>
                </div>
            );
        } else {
            return (
                <div className="bg-white sh p-md r-md ta-center v gap-sm">
                    <div>{ member.name }</div>
                    <div>{ member.email }</div>
                    <button className="btn-sm" onClick={ () => onBan(member) }>Заблокировать</button>
                </div>
            );
        }
    };

    const membersElements = members.length === 0 ? <p>Список участников пуст</p> :
                            members.map(memberMapper);

    const joinLink = `http://localhost:3000/groups/join/${groupToken}`;

    return (
        <div className="h-full bg-white p-lg">
            <h1>Пригласите участников</h1>

            <div className="mg-v-md">
                <KeyValue name="Ссылка" value={ joinLink } />
            </div>
            <QRCode className="mg-v-md" size={128} value={ joinLink } />

            <form className="h gap-sm mg-v-md" onSubmit={ onInvite }>
                <TextField placeholder="Введите почту" text={ inviteEmail } setText={ setInviteEmail } />
                <Button loading={ loading }>Пригласить</Button>
            </form>

            <h1>Участники</h1>

            <div className="h wrap gap-md mg-t-md">
                { membersElements }
            </div>
        </div>
    );
};


export default MembersAdminFragment;