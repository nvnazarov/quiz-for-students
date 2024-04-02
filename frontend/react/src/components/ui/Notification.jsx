const Notification = ({ message, isError }) => {
    if (isError) {
        return (
            <span className="Notification">{ message }</span>
        );
    } else {
        return (
            <span className="Notification Good">{ message }</span>
        );
    }
};


export default Notification;