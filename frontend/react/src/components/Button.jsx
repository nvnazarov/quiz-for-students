import Loader from "./Loader";


const Button = ({ children, loading = false }) => {
    return (
        <button className="btn r-md bg-orange p-md">
            { loading ? <Loader /> : children }
        </button>
    );
};


export default Button;