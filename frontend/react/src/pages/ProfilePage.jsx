import { Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import SideNavigationFragment from "../components/fragments/SideNavigationFragment";
import ProfileFragment from "../components/fragments/profile/ProfileFragment";
import QuizzesFragment from "../components/fragments/profile/QuizzesFragment";
import GroupsFragment from "../components/fragments/profile/GroupsFragment";
import OwnedGroupsFragment from "../components/fragments/profile/OwnedGroupsFragment";
import { useProfileData } from "../hooks/profile";
import { updateUser } from "../api/user";
import { createGroup, joinByInvite, cancelInvite } from "../api/group";
import InvitesFragment from "../components/fragments/profile/InvitesFragment";
import Notification from "../components/ui/Notification";


const ProfilePage = () => {
    const [token, setToken] = useContext(UserContext);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const profileData = useProfileData(token);
    const [ message, setMessage ] = useState(
        {
            ok: false,
            hint: null,
        }
    );

    const categories = [
        "Профиль",
        "Квизы",
        "Группы",
        "Мои группы",
        "Приглашения",
        "Выйти",
    ];

    const onUpdateUserName = async (newUserName) => {
        const data = {
            authToken: token,
            name: newUserName,
        };
        const response = await updateUser(data);

        if (response !== undefined && response.ok) {
            profileData.setUser(
                {
                    name: newUserName,
                    email: profileData.user.email,
                }
            );
        }
    };

    const onCreateNewGroup = async (newGroupName) => {
        const data = {
            authToken: token,
            name: newGroupName,
        };
        const response = await createGroup(data);

        if (response !== undefined && response.ok) {
            profileData.loadMyGroups();
        }
    };

    const onJoinByInvite = async (id) => {
        setMessage({ ok: false, hint: null });
        const response = await joinByInvite({ authToken: token, inviteId: id });

        if (response === undefined) {
            setMessage({ ok: false, hint: "Попробуйте в другой раз." });
            return;
        }

        if (!response.ok) {
            setMessage({ ok: false, hint: "Не удалось вступить в группу." });
            return;
        }

        setMessage({ ok: true, hint: "Успешно." });
        profileData.loadInvites();
        profileData.loadGroups();
    };

    const onCancelInvite = async (id) => {
        setMessage({ ok: false, hint: null });
        const response = await cancelInvite({ authToken: token, inviteId: id });

        if (response === undefined) {
            setMessage({ ok: false, hint: "Попробуйте в другой раз." });
            return;
        }

        if (!response.ok) {
            setMessage({ ok: false, hint: "Не удалось отклонить приглашение." });
            return;
        }

        setMessage({ ok: true, hint: "Успешно." });
        profileData.loadInvites();
    };

    const onUpdateInvites = () => {
        profileData.loadInvites();
    };

    const fragments = [
        <ProfileFragment
            userName={ profileData.user.name }
            userEmail={ profileData.user.email }
            onUpdateUserName={ onUpdateUserName } />,
        <QuizzesFragment quizzes={ profileData.quizzes } />,
        <GroupsFragment groups={ profileData.groups } />,
        <OwnedGroupsFragment groups={ profileData.myGroups } onCreateNewGroup={ onCreateNewGroup } />,
        <InvitesFragment
            invites={ profileData.invites }
            onJoinByInvite={ onJoinByInvite }
            onCancelInvite={ onCancelInvite }
            onUpdate={ onUpdateInvites } />

    ];

    const onCategorySelect = (index) => {
        setCategoryIndex(index);
    };

    if (categoryIndex === categories.length - 1) {
        setToken(null);
        return <Navigate to="/login" />;
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
};


export default ProfilePage;