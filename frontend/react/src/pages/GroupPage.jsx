import { Navigate } from "react-router-dom";
import { useState } from "react";
import SideNavigationFragment from "../components/fragments/SideNavigationFragment";
import GamesFragment from "../components/fragments/group/GamesFragment";
import MembersFragment from "../components/fragments/group/MembersFragment";
import ChatFragment from "../components/fragments/group/ChatFragment";


const GroupPage = () => {
    const [categoryIndex, setCategoryIndex] = useState(0);

    const categories = [
        "Игры",
        "Участники",
        "Чат",
        "Назад",
    ];

    const fragments = [
        <GamesFragment />,
        <MembersFragment />,
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


export default GroupPage;