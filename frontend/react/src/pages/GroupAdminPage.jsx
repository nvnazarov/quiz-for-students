import { Navigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import SideNavigationFragment from "../components/fragments/SideNavigationFragment";
import GamesAdminFragment from "../components/fragments/group/GamesAdminFragment";
import MembersAdminFragment from "../components/fragments/group/MembersAdminFragment";
import ChatFragment from "../components/fragments/group/ChatFragment";
import { useGroupAdminData } from "../hooks/group";
import { banGroupMember, inviteUser, unbanGroupMember } from "../api/group";
import { createGame } from "../api/game";
import Notification from "../components/ui/Notification";


const GroupAdminPage = () => {
    const { id } = useParams();
    const [token] = useContext(UserContext);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const groupAdminData = useGroupAdminData(token, id);
    const [ message, setMessage ] = useState(
        {
            ok: false,
            hint: null,
        }
    );

    const categories = [
        "Игры",
        "Участники",
        "Чат",
        "Назад",
    ];

    const onBan = async (member) => {
        const data = {
            authToken: token,
            groupId: id,
            memberId: member.id,
        };
        setMessage({ ok: true, hint: null });
        const response = await banGroupMember(data);

        if (response !== undefined && response.ok) {
            groupAdminData.loadGroupMembers();
            setMessage({ ok: true, hint: "Успешно." });
        } else {
            setMessage({ ok: false, hint: "Не удалось заблокировать пользователя." });
        }
    };

    const onUnban = async (member) => {
        const data = {
            authToken: token,
            groupId: id,
            memberId: member.id,
        };
        setMessage({ ok: true, hint: null });
        const response = await unbanGroupMember(data);

        if (response !== undefined && response.ok) {
            groupAdminData.loadGroupMembers();
            setMessage({ ok: true, hint: "Успешно." });
        } else {
            setMessage({ ok: false, hint: "Не удалось разблокировать пользователя." });
        }
    };

    const onCreateGame = async (quizId) => {
        if (!quizId) {
            setMessage({ ok: false, hint: null });
            await new Promise((resolve) => resolve(undefined));
            setMessage({ ok: false, hint: "Не удалось создать игру. Не выбран квиз." });
            return;
        }

        const data = {
            authToken: token,
            groupId: id,
            quizId,
        };
        setMessage({ ok: false, hint: null });
        const response = await createGame(data);

        if (response !== undefined && response.ok) {
            groupAdminData.loadCurrentGame();
            setMessage({ ok: true, hint: "Успешно." });
        } else {
            setMessage({ ok: false, hint: "Не удалось создать игру." });
        }
    };

    const onInvite = async (email) => {
        setMessage({ ok: false, hint: null });
        const response = await inviteUser({ authToken: token, groupId: id, email: email });

        if (response === undefined) {
            setMessage({ ok: false, hint: "Попробуйте в другой раз." });
            return;
        }

        if (!response.ok) {
            setMessage({ ok: false, hint: "Не удалось пригласить пользователя. Возможно, почта некорректна." });
            return;
        }

        setMessage({ ok: true, hint: "Успешно." });
    };

    const fragments = [
        <GamesAdminFragment
            currentGame={ groupAdminData.currentGame }
            results={ groupAdminData.results }
            members={ groupAdminData.members }
            quizzes={ groupAdminData.quizzes }
            onCreateGame={ onCreateGame } />,
        <MembersAdminFragment
            members={ groupAdminData.members }
            groupToken={ groupAdminData.groupToken }
            onBan={ onBan }
            onUnban={ onUnban }
            onInvite={ onInvite } />,
        <ChatFragment />
    ];

    const onCategorySelect = (index) => {
        setCategoryIndex(index);
    };

    if (categoryIndex === categories.length - 1) {
        return <Navigate to="/profile" />;
    }

    return (
        <div className="ProfileLayout">
            <div className="ProfileNavigation">
                <SideNavigationFragment
                    categories={ categories }
                    selectedIndex={ categoryIndex }
                    onSelect={ onCategorySelect } />
            </div>
            <div className="ProfileMain">
                { fragments[categoryIndex] }
            </div>
            {
                message.hint && <Notification message={ message.hint } isError={ !message.ok } />
            }
        </div>
    );
}


export default GroupAdminPage;