import { useState, useEffect } from 'react';
import { apiUrl } from '../config';


const useGroupData = (token, groupId) => {
    const [members, setMembers] = useState(null);
    const [history, setHistory] = useState(null);

    const fetchRequest = {
        headers: {
            token: token,
        }
    };

    const loadMembers = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}/members`, fetchRequest);
        
        if (!response.ok) {
            setMembers(undefined);
            return;
        }

        const json = await response.json();
        setMembers(json);
    }

    const loadHistory = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}/history`, fetchRequest);
        
        if (!response.ok) {
            setHistory(undefined);
            return;
        }

        const json = await response.json();
        setHistory(json);
    }

    useEffect(() => {

        loadMembers();
        loadHistory();

    }, [])

    return [
        {
            members: members,
            history: history,
        },
        loadMembers,
        loadHistory,
    ];
}


export { useGroupData };