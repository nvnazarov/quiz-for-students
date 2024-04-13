import { createContext, useState } from "react";

import "../styles/Notification.css";

const NotificationContext = createContext();

const NotificationType = {
    Error: 0,
    Success: 1,
};

const Notification = ({ message, type }) => {
    if (type === NotificationType.Error) {
        return (
            <div className="notification error">{ message }</div>
        );
    }

    if (type === NotificationType.Success) {
        return (
            <div className="notification success">{ message }</div>
        );
    }
};


const NotificationContextProvider = ({ children }) => {
    const [message, setMessage] = useState(null);
    const [messageId, setMessageId] = useState(0);

    const addNotification = (message, type = NotificationType.Error) => {
        setMessage({ text: message, type });
        setMessageId(i => i + 1);
    };

    return (
        <NotificationContext.Provider value={ { addNotification } }>
            { children }
            { message && <Notification key={ messageId } message={ message.text } type={ message.type }/> }
        </NotificationContext.Provider>
    );
};


export {
    NotificationContext,
    NotificationContextProvider,
    NotificationType,
};