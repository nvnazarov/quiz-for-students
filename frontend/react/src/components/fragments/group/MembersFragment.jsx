import { useParams } from "react-router-dom";
import { useContext } from "react";
import { useMembers } from "../../../hooks/hooks";
import { UserContext } from "../../../contexts/UserContext"
import Loader from "../../Loader";


const MembersFragment = () => {
    const { groupId } = useParams();
    const [authToken] = useContext(UserContext);
    const [members] = useMembers(authToken, groupId);

    if (members === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Участники</h1>

                Не удалось загрузить участников.
            </div>
        );
    }

    if (members === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Участники</h1>
                <div className="mg-v-md">
                    <Loader />
                </div>                
            </div>
        );
    }
    
    const memberMapper = (member) => {
        return (
            <div key={ member.id } className="bg-white sh p-md r-md ta-center v gap-sm">
                <div>{ member.name }</div>
                <div>{ member.email }</div>
            </div>
        );
    };

    const membersElements = members === undefined ? <>Не удалось загрузить участников</> :
                            members.length === 0 ? <>Список участников пуст</> :
                            members.map(memberMapper);

    return (
        <div className="h-full p-lg bg-white">
            <h1>Участники</h1>

            <div className="Grid VerticalMargin">
                {
                    membersElements
                }
            </div>
        </div>
    );
};


export default MembersFragment;