import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/ui/Loader";
import { activateUser } from "../api/user";


const UserActivatePage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState(undefined);

    const onActivateUser = async () => {
        const data = {
            activateToken: token,
        };
        const response = await activateUser(data);
        
        if (response === undefined) {
            setStatus(500);
        }

        setStatus(response.status);
    };

    useEffect(() => { onActivateUser(); }, []);

    return (
        <div className="Centered Box">
            <div className="List">
                <h1>Активация аккаунта</h1>
                {
                    status === undefined ?
                    <div className="Mid">
                        <Loader />
                    </div>
                    : status === 500 ?
                    <>
                        <p>Попробуйте в другой раз</p>
                        <Link className="Button" to="/login">Авторизоваться</Link>
                    </>
                    : status === 400 ?
                    <>
                        <p>Ссылка недействительна</p>
                        <Link className="Button" to="/login">Авторизоваться</Link>
                    </>
                    : 
                    <>
                        <p>Аккаунт успешно активирован</p>
                        <Link className="Button" to="/login">Авторизоваться</Link>
                    </>
                }
            </div> 
        </div>
    );
};


export default UserActivatePage;