import {useEffect} from 'react';
import {apiUrl} from '../config';
import {useParams} from 'react-router-dom';


const TestGamePage = () => {
    const {gameId} = useParams(); 

    useEffect(() => {
        const websocket = WebSocket(`${apiUrl}/games/${gameId}`);
    }, []);
    
    return (
        <>Test game</>
    );
}


export default TestGamePage;