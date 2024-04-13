import { createContext, useState } from "react";

import "../styles/Notification.css";

const NotificationContext = createContext();


const Notification = ({ message }) => {
    return (
        <div className="notification">{ message }</div>
    );
};


const NotificationContextProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const [messageId, setMessageId] = useState(0);

    const addNotification = (message) => {
        setMessage(message);
        setMessageId(i => i + 1);
    };

    return (
        <NotificationContext.Provider value={ { addNotification } }>
            { children }
            { message && <Notification key={ messageId } message={ message }/> }
        </NotificationContext.Provider>
    );
};


export {
    NotificationContext,
    NotificationContextProvider,
};