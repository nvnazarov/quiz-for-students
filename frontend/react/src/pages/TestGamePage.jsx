import { useEffect, useContext, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Stats from "../components/Stats";
import CircularProgress from "@mui/material/CircularProgress";
import SingleSelect from "../components/SingleSelect";
import MultipleSelect from "../components/MultipleSelect";
import Timer from "../components/Timer";
import Notification from "../components/ui/Notification";


const TestGamePage = () => {
    const [ token, ] = useContext(UserContext);
    const { gameId } = useParams();
    const [ state, setState ] = useState(null);
    const [ socket, setSocket ] = useState(null);
    const [ closed, setClosed ] = useState(false);
    const [ message, setMessage ] = useState({ ok: false, hint: null });

    useEffect(() => {
        
        const socket = new WebSocket(`ws://localhost:8000/api/games/${gameId}/ws/${token}`);
        setSocket(socket);

    }, []);

    if (closed) {
        return (
            <>
                Отключен.
            </>
        );
    }

    if (socket === null) {
        return (
            <>
                <CircularProgress /> Connecting...
            </>
        );
    }

    socket.onopen = (e) => {
    };

    const checkAnswer = (answer, correct) => {
        if (!answer) {
            return false;
        }
        if (Array.isArray(correct)) {
            answer.sort();
            correct.sort();
            return answer.toString() === correct.toString();
        } else {
            return answer === correct;
        }
    };

    socket.onmessage = async (e) => {
        const json = JSON.parse(e.data);

        if (json.state !== undefined) {
            if (state && state.state === "question" && json.state === "results") {
                if (checkAnswer(state.data.ans, json.data.correct)) {
                    setMessage({ ok: true, hint: "Вы ответили верно." });
                } else {
                    setMessage({ ok: false, hint: "Вы ответили неверно." });
                }
                await new Promise(r => setTimeout(r, 3000));
                setMessage({ ok: false, hint: null });
                setState(json);
            } else {
                setState(json);
            }
        } else {
            if (state !== null) {
                if (json.action === "member" && state.state === "lobby") {
                    setState({ ...state, data: { members: [...state.data.members, json.data.member] } });
                }
                if (json.action === "answer" && state.state === "question") {
                    setState({ ...state, data: {  } });
                }
            }
        }
    };

    socket.onclose = (e) => {
        setClosed(true);
    };

    if (state === null) {
        return (
            <>
                <CircularProgress /> Getting state...
            </>
        );
    }


    if (state.state === "lobby") {
        const memberMapper = (member) => {
            return (
                <div key={member.id}>
                    {member.name} ({member.email})
                </div>
            );
        };

        const membersElements = state.data.members.length === 0 ? <>Список участников пуст</> :
                                state.data.members.map(memberMapper);

        return (
            <div className="GamePage">
                <div className="Centered Vertical GapSmall box">
                    <h1>Ожидание участников</h1>

                    <div className="Vertical GapSmall VerticalMargin">
                    {
                        membersElements
                    }
                    </div>
                </div>
            </div>
        );
    }

    if (state.state === "question") {
        return (
            <>
                {
                    message.hint && <Notification message={ message.hint } isError={ !message.ok } />
                }
                <div className="Centered box">
                    <Timer seconds={ state.data.q.time } />
                    <h1 className="text-centered">{ state.data.q.title }</h1>
                    {
                        state.data.q.type === "SingleAnswer" ?
                        <>
                            <>Выберите один ответ</>
                            <SingleSelect answers={ state.data.q.answers } onSelect={
                                (index) => {
                                    socket.send(index);
                                    setState({ ...state, data: { ...state.data, ans: index } });
                                }
                            } />
                        </>
                        :
                        <>
                            <>Выберите один или несколько ответов</>
                            <MultipleSelect answers={ state.data.q.answers } onSelect={
                                (indexes) => {
                                    socket.send(indexes);
                                    setState({ ...state, data: { ...state.data, ans: indexes } });
                                }
                            } />
                        </> 
                    }
                </div>
            </>
        );
    }

    if (state.state === "results") {
        let corr = state.data.correct;
        if (!Array.isArray(corr)) {
            corr = [corr];
        }
        return (
            <div className="Centered box">
                <div>
                    <h1>{ state.data.q.title }</h1>
                </div>
                <div className="VerticalMargin">
                    <Stats values={ state.data.stats } labels={ state.data.q.answers } correct={ corr } />
                </div>
            </div>
        );
    }

    if (state.state === "finished") {
        socket.close();

        const groupId = state.data.group_id;
        return <Navigate to={ `/groups/${groupId}` } />;
    }
}


export default TestGamePage;