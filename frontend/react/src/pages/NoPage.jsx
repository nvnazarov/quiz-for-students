import {Link} from "react-router-dom";
import "../styles/common.css";


const NoPage = () => {
    return (
        <div className="center bg-white p-md r-md">
            <div className="ErrorCode ta-center">404</div>
            <Link className="btn-sm ta-center" to="/profile">На страницу профиля</Link>
        </div>
    );
};


export default NoPage;