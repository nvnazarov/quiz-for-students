import { Navigate } from "react-router-dom";
import { useState } from "react";
import SideNavigationFragment from "../components/fragments/SideNavigationFragment";
import GamesAdminFragment from "../components/fragments/group/GamesAdminFragment";
import MembersAdminFragment from "../components/fragments/group/MembersAdminFragment";
import ChatFragment from "../components/fragments/group/ChatFragment";


const GroupAdminPage = () => {
    const [categoryIndex, setCategoryIndex] = useState(0);

    const categories = [
        "Игры",
        "Участники",
        "Чат",
        "Назад",
    ];

    const fragments = [
        <GamesAdminFragment />,
        <MembersAdminFragment />,
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
        </div>
    );
}


export default GroupAdminPage;