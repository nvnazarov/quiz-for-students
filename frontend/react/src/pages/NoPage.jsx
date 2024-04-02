import {Link} from "react-router-dom";


const NoPage = () => {
    return (
        <div className="Centered Vertical">
            <div className="ErrorCode Mid">404</div>
            <Link className="Mid" to="/profile">Profile</Link>
        </div>
    );
};


export default NoPage;