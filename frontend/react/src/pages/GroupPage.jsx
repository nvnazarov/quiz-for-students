import { Navigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import SideNavigationFragment from "../components/fragments/SideNavigationFragment";
import GamesFragment from "../components/fragments/group/GamesFragment";
import MembersFragment from "../components/fragments/group/MembersFragment";
import ChatFragment from "../components/fragments/group/ChatFragment";
import { useGroupData } from "../hooks/group";


const GroupPage = () => {
    const { id } = useParams();
    const [token] = useContext(UserContext);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const groupData = useGroupData(token, id);

    const categories = [
        "Игры",
        "Участники",
        "Чат",
        "Назад",
    ];

    const fragments = [
        <GamesFragment currentGame={ groupData.currentGame } results={ groupData.results } />,
        <MembersFragment members={ groupData.members } />,
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