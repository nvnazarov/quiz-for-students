import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Loader from "../components/Loader";
import { joinGroup } from "../api/group";
import "../styles/common.css";


const GroupJoinPage = () => {
    const [authToken] = useContext(UserContext);
    const { groupToken } = useParams();
    const [status, setStatus] = useState(undefined);

    const onJoinGroup = async () => {
        const data = {
            authToken,
            groupToken,  
        };
        const response = await joinGroup(data);
        
        if (response === undefined) {
            setStatus(500);
        }

        setStatus(response.status);
    };

    useEffect(() => { onJoinGroup(); }, []);

    return (
        <div className="center bg-white r-lg p-lg w-md">
            <div className="List">
                <h1>Вступление в группу</h1>
                {
                    status === undefined ?
                    <div className="ta-center">
                        <Loader />
                    </div>
                    : status === 500 ?
                    <>
                        <p className="ta-center">Попробуйте в другой раз.</p>
                        <Link className="btn-sm ta-center" to="/me/groups">Посмотреть группы</Link>
                    </>
                    : status === 406 ?
                    <>
                        <p className="ta-center">Это Ваша группа.</p>
                        <Link className="btn-sm ta-center" to="/me/groups">Посмотреть группы</Link>
                    </>
                    : status === 404 ?
                    <>
                        <p className="ta-center">Группа не существует.</p>
                        <Link className="btn-sm ta-center" to="/me/groups">Посмотреть группы</Link>
                    </>
                    : status === 401 ?
                    <>
                        <p className="ta-center">Вы неавторизованы.</p>
                        <Link className="btn-sm ta-center" to="/login">Авторизоваться</Link>
                    </>
                    : status === 400 ?
                    <>
                        <p className="ta-center">Токен истек или неисправен.</p>
                        <Link className="btn-sm ta-center" to="/profile">Посмотреть группы</Link>
                    </>
                    :
                    <>
                        <p className="ta-center">Вы присоединились к группе.</p>
                        <Link className="btn-sm ta-center" to="/profile">Посмотреть группы</Link>
                    </>
                }
            </div> 
        </div>
    );
};


export default GroupJoinPage;