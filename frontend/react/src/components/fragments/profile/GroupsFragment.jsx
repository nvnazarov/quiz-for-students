import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext";
import { useGroups } from "../../../hooks/hooks";
import Loader from "../../Loader";
import "../../../styles/common.css";


const GroupCard = ({ group }) => {
    return (
        <Link to={ `/groups/${group.id}` } className="c-gray p-md r-md bg-gray w-md bounce v-center">
            { group.name }
        </Link>
    );
};


const GroupsFragment = () => {
    const [authToken] = useContext(UserContext);
    const [groups] = useGroups(authToken);

    if (groups === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Группы</h1>
                
                <div className="mg-v-md">
                    <Loader />
                </div>
            </div>
        );
    }


    if (groups === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Группы</h1>
                
                <p className="mg-v-md">Не удалось загрузить группы.</p>
            </div>
        );
    }

    const groupsElements = groups.map(g => <GroupCard key={ g.id } group={ g } />);

    return (
        <div className="h-full bg-white p-lg">
            <h1>Группы</h1>

            <div className="h gap-md wrap mg-v-md">
                { groupsElements.length === 0 ? <p>Вы пока не вступили ни в одну группу.</p> : groupsElements }
            </div>
        </div>
    );
};


export default GroupsFragment;