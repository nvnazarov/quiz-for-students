import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Loader from "../components/ui/Loader";
import { joinGroup } from "../api/group";


const GroupJoinPage = () => {
    const [ token, ] = useContext(UserContext);
    const { groupToken } = useParams();
    const [status, setStatus] = useState(undefined);

    const onJoinGroup = async () => {
        const data = {
            authToken: token,
            groupToken: groupToken,  
        };
        const response = await joinGroup(data);
        
        if (response === undefined) {
            setStatus(500);
        }

        setStatus(response.status);
    };

    useEffect(() => { onJoinGroup(); }, []);

    return (
        <div className="Centered Box">
            <div className="List">
                <h1>Вступление в группу</h1>
                {
                    status === undefined ?
                    <div className="Mid">
                        <Loader />
                    </div>
                    : status === 500 ?
                    <>
                        <p>Попробуйте в другой раз.</p>
                        <Link className="Button" to="/me/groups">Посмотреть группы</Link>
                    </>
                    : status === 406 ?
                    <>
                        <p>Это Ваша группа.</p>
                        <Link className="Button" to="/me/groups">Посмотреть группы</Link>
                    </>
                    : status === 404 ?
                    <>
                        <p>Группа не существует.</p>
                        <Link className="Button" to="/me/groups">Посмотреть группы</Link>
                    </>
                    : status === 401 ?
                    <>
                        <p>Вы неавторизованы.</p>
                        <Link className="Button" to="/login">Авторизоваться</Link>
                    </>
                    : 
                    <>
                        <p>Вы присоединились к группе.</p>
                        <Link className="Button" to="/profile">Посмотреть группы</Link>
                    </>
                }
            </div> 
        </div>
    );
};


export default GroupJoinPage;