import { useState, useEffect } from 'react';
import { apiUrl } from '../config';


const useGroupData = (token, groupId) => {
    const [name, setName] = useState(null);
    const [game, setGame] = useState('loading');
    const [members, setMembers] = useState(null);
    const [history, setHistory] = useState(null);
    const [quizzes, setQuizzes] = useState(null);
    const [groupToken, setGroupToken] = useState(null); 

    const fetchRequest = {
        headers: {
            token: token,
        }
    };

    const loadName = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setName(undefined);
            return;
        }

        const json = await response.json();
        setName(json.name);
    }

    const loadMembers = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}/members`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setMembers(undefined);
            return;
        }

        const json = await response.json();
        setMembers(json);
    }

    const loadGame = async () => {
        const response = await fetch(`${apiUrl}/games/${groupId}`, fetchRequest).catch(() => {});
        
        if (response === undefined) {
            setGame(undefined);
            return;
        }

        if (!response.ok) {
            setGame(null);
            return;
        }

        const json = await response.json();
        setGame(json);
    }

    const loadHistory = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}/history`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setHistory(undefined);
            return;
        }

        const json = await response.json();
        setHistory(json);
    }

    const loadQuizzes = async () => {
        const response = await fetch(`${apiUrl}/quizzes/my`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setQuizzes(undefined);
            return;
        }

        const json = await response.json();
        setQuizzes(json);
    }

    const loadGroupToken = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}/token`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setGroupToken(undefined);
            return;
        }

        const json = await response.json();
        setGroupToken(json);
    }

    useEffect(() => {

        loadName();
        loadGame();
        loadMembers();
        loadHistory();
        loadQuizzes();
        loadGroupToken();

    }, [])

    return [
        {
            token: groupToken,
            name: name,
            game: game,
            members: members,
            history: history,
            quizzes: quizzes,
        },
        loadName,
        loadMembers,
        loadHistory,
        loadGame,
    ];
}


export { useGroupData };