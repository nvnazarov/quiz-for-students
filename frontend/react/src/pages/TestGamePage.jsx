import {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {UserContext} from '../contexts/UserContext';


const TestGamePage = () => {
    const [token, ] = useContext(UserContext);
    const { gameId } = useParams(); 
    const [data, setData] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/api/games/${gameId}/ws/${token}`);

        socket.onopen = (e) => {
        };

        socket.onmessage = (e) => {
            setData(JSON.parse(e.data));
        };

        socket.onclose = (e) => {
            console.log(e);
        };
    }, []);


    if (data === null) {
        return (
            <>
                Loading
            </>
        );
    }

    if (data.question === undefined && data.members !== undefined) {
        const membersCards = data.members.map((m) => (
            <div key={m.id}>
                {m.name} {m.email}
            </div>
        ))

        return (
            <div className='List'>
            <h1>Ожидание участников</h1>
            {
                membersCards
            }
            </div>
        );
    }

    return (
        <>
            hmm
        </>
    );
}


export default TestGamePage;