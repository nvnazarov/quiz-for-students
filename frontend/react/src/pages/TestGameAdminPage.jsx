import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';


const TestGameAdminPage = () => {
    const [token, ] = useContext(UserContext);
    const { gameId } = useParams();
    const [state, setState] = useState(
        {
            state: "lobby",
            members: [],
        }
    );
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/api/games/${gameId}/ws/${token}`);

        socket.onopen = (e) => {
        };

        socket.onmessage = (e) => {
            const json = JSON.parse(e.data);
            if (json.state !== undefined) {
                setState(json);
            } else {
                if (json.action === "member") {
                    setState(
                        {
                            state: state.state,
                            members: [...state.members, json.data],
                        }
                    );
                }
            }
        };

        socket.onclose = (e) => {
        };

        setSocket(socket);
    }, []);


    const onStartGame = () => {
        socket.send("start");
    };

    const onStopQuestion = () => {
        socket.send("stop");
    };

    const onNextQuestion = () => {
        socket.send("next");
    };

    if (state.state == "lobby") {
        const memberMapper = (member) => {
            return (
                <div key={member.id}>
                    {member.name} {member.email}
                </div>
            );
        };

        const membersElements = state.members.length === 0 ? <>Список участников пуст</> :
                                state.members.map(memberMapper);

        return (
            <div className="GamePage">
                <div className="Centered Vertical GapSmall">
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

    if (state.state == "question") {
        return (
            <div>
            </div>
        );
    }
}


export default TestGameAdminPage;