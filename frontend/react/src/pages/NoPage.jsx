import {Link} from "react-router-dom";


const NoPage = () => {
    return (
        <>
            This page does not exist.
            <br/>
            <Link to="/">Home</Link>
            <br/>
            <Link to="/profile">Profile</Link>
        </>
    );
}


export default NoPage;