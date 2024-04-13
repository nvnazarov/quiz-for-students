import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import SideNavigationFragment from "../components/fragments/SideNavigationFragment";
import ProfileFragment from "../components/fragments/profile/ProfileFragment";
import QuizzesFragment from "../components/fragments/profile/QuizzesFragment";
import GroupsFragment from "../components/fragments/profile/GroupsFragment";
import OwnedGroupsFragment from "../components/fragments/profile/OwnedGroupsFragment";
import InvitesFragment from "../components/fragments/profile/InvitesFragment";


const ProfilePage = () => {
    const [, setToken] = useContext(UserContext);
    const [categoryIndex, setCategoryIndex] = useState(0);

    const categories = [
        "Профиль",
        "Квизы",
        "Группы",
        "Мои группы",
        "Приглашения",
        "Выйти",
    ];

    const fragments = [
        <ProfileFragment />,
        <QuizzesFragment />,
        <GroupsFragment />,
        <OwnedGroupsFragment />,
        <InvitesFragment />,
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
        </div>
    );
};


export default ProfilePage;