import {useEffect} from 'react';
import {apiUrl} from '../config';
import {useParams} from 'react-router-dom';


const TestGamePage = () => {
    const {gameId} = useParams(); 

    useEffect(() => {
        const socket = WebSocket(`${apiUrl}/games/ws/${gameId}`);

        socket.onmessage = (e) => {
            console.log(e.data);
        };

        socket.send('GET');
    }, []);
    
    return (
        <>Test game</>
    );
}


export default TestGamePage;