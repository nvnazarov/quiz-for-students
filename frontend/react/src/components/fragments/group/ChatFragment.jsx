import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { NotificationContext, NotificationType } from "../../../contexts/NotificationContext";
import { getAllMessages } from "../../../api/chat";
import TextField from "../../TextField";
import Button from "../../Button";


const ChatFragment = () => {
    const notificationService = useContext(NotificationContext);
    const [authToken] = useContext(UserContext);
    const { groupId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [socket, setSocket]  = useState(null);

    useEffect(() => {
        let ws = null;

        const connect = async () => {
            const response = await getAllMessages({ authToken, groupId });

            if (response === undefined || !response.ok) {
                notificationService.addNotification("Не удалось загрузить историю сообщений");
            } else {
                const msgs = await response.json();
                msgs.reverse();
                setMessages(msgs);
            }

            ws = new WebSocket(`ws://localhost:8000/api/chat/ws/${groupId}/${authToken}`);

            ws.onmessage = async (e) => {
                const msg = JSON.parse(e.data);

                if (msg.what) {
                    notificationService.addNotification("Не удалось отправить сообщение.");
                } else {
                    setMessages((m) => [ msg, ...m  ]);
                }
            };

            ws.onclose = () => {
                setSocket(null);
            };

            setSocket(ws);
        };

        connect();
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [groupId]);

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (socket) {
            socket.send(text);
            setText("");
            notificationService.addNotification("Сообщение отправлено.", NotificationType.Success);
        } else {
            notificationService.addNotification("Подождите, пока вас подключит к чату.");
        }
    };

    const messageMapper = (m, index) => {
        return (
            <div className="Vertical GapSmall Message" key={index}>
                <div className="Horizontal VerticalCentered">
                    <div className="MessageAuthor">{ m.name }</div>
                    <div className="MessageDate">{ m.date }</div>
                </div>
                { m.content }
            </div>
        );
    };
    const messagesElements = messages.map(messageMapper);

    return (
        <div className="Page">
            <h1>Чат</h1>

            <form className="h gap-sm mg-v-md" onSubmit={ onSubmit }>
                <TextField placeholder="Введите сообщение" text={ text } setText={ setText } />
                <Button>Отправить</Button>
            </form>

            <div className="v gap-sm">
                { messagesElements }
            </div>
        </div>
    );
};


export default ChatFragment;