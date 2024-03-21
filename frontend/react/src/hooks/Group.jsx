import { useState, useEffect } from 'react';
import { apiUrl } from '../config';


const useGroupData = (token, groupId) => {
    const [name, setName] = useState(null);
    const [members, setMembers] = useState(null);
    const [history, setHistory] = useState(null);

    const fetchRequest = {
        headers: {
            token: token,
        }
    };

    const loadName = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}/name`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setName(undefined);
            return;
        }

        const json = await response.json();
        setName(json);
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

    const loadHistory = async () => {
        const response = await fetch(`${apiUrl}/groups/${groupId}/history`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setHistory(undefined);
            return;
        }

        const json = await response.json();
        setHistory(json);
    }

    useEffect(() => {

        loadName();
        loadMembers();
        loadHistory();

    }, [])

    return [
        {
            name: name,
            members: members,
            history: history,
        },
        loadName,
        loadMembers,
        loadHistory,
    ];
}


export { useGroupData };