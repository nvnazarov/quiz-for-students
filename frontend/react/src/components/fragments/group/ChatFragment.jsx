import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import Notification from "../../ui/Notification";
import { getAllMessages } from "../../../api/chat";
import TextField from "../../ui/TextField";
import SubmitButton from "../../ui/SubmitButton";


const ChatFragment = () => {
    const [ token, ] = useContext(UserContext);
    const { id } = useParams();
    const [ message, setMessage ] = useState({ ok: false, hint: null });
    const [ messages, setMessages ] = useState([]);
    const [ text, setText ] = useState("");
    const [ socket, setSocket ]  = useState(null);

    useEffect(() => {
        let ws = null;

        const connect = async () => {
            setMessage({ ok: false, hint: null });
            const response = await getAllMessages({ authToken: token, groupId: id });

            if (response === undefined || !response.ok) {
                setMessage({ ok: false, hint: "Не удалось загрузить историю сообщений" });
            } else {
                const msgs = await response.json();
                msgs.reverse();
                setMessages(msgs);
            }

            ws = new WebSocket(`ws://localhost:8000/api/chat/ws/${id}/${token}`);

            ws.onmessage = async (e) => {
                const msg = JSON.parse(e.data);

                console.log(msg);

                if (msg.what) {
                    setMessage({ ok: false, hint: "Не удалось отправить сообщение." });
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
    }, [id]);

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (socket) {
            socket.send(text);
            setText("");
            setMessage({ ok: true, hint: "Сообщение отправлено." });
        } else {
            setMessage({ ok: false, hint: "Подождите, пока вас подключит к чату." });
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

            <form className="Horizontal GapSmall VerticalMargin" onSubmit={ onSubmit }>
                <TextField placeholder="Введите сообщение" text={ text } setText={ setText } />
                <SubmitButton title="Отправить" />
            </form>

            <div className="Vertical GapSmall">
            {
                messagesElements
            }
            </div>
            
            {
                message.hint && <Notification message={ message.hint } isError={ !message.ok } />
            }
        </div>
    );
};


export default ChatFragment;