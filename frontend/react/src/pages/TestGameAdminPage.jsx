import { useEffect, useContext, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Stats from "../components/Stats";
import CircularProgress from "@mui/material/CircularProgress";
import Timer from "../components/Timer";


const TestGameAdminPage = () => {
    const [ token, ] = useContext(UserContext);
    const { gameId } = useParams();
    const [ state, setState ] = useState(null);
    const [ socket, setSocket ] = useState(null);
    const [ closed, setClosed ] = useState(false);

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

    socket.onmessage = (e) => {
        const json = JSON.parse(e.data);

        if (json.state !== undefined) {
            setState(json);
        } else {
            if (json.action === "member" && state.state === "lobby") {
                setState({ ...state, data: { members: [...state.data.members, json.data.member] } });
            }
            if (json.action === "answer" && state.state === "question") {
                setState({ ...state, data: {  } });
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

    const onStartGame = () => {
        socket.send("start");
    };

    const onStopQuestion = () => {
        socket.send("stop");
    };

    const onNextQuestion = () => {
        socket.send("next");
    };

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
                    
                    <button onClick={ onStartGame }>Начать игру</button>
                </div>
            </div>
        );
    }

    if (state.state === "question") {
        const answerMapper = (answer) => {
            return (
                <div className="Card">
                    { answer }
                </div>
            );
        };
        const answersElements = state.data.q.answers.map(answerMapper);

        return (
            <div className="Centered box">
                <Timer seconds={ state.data.q.time } />
                <h1 className="text-centered">{ state.data.q.title }</h1>
                <div className="q-answers-container">
                    { answersElements }
                </div>
                <div className="text-centered">
                    <button onClick={ onStopQuestion }>Закончить вопрос</button>
                </div>
            </div>
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
                <div className="text-centered">
                    <button onClick={ onNextQuestion }>Следующий вопрос</button>
                </div>
            </div>
        );
    }

    if (state.state === "finished") {
        socket.close();

        const groupId = state.data.group_id;
        return <Navigate to={ `/groups/my/${groupId}` } />;
    }
}


export default TestGameAdminPage;