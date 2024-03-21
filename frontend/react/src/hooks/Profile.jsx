import { useState, useEffect } from 'react';
import { apiUrl } from '../config';


const useProfileData = (token) => {
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState(null);
    const [myGroups, setMyGroups] = useState(null);
    const [quizzes, setQuizzes] = useState(null);

    const fetchRequest = {
        headers: {
            token: token,
        }
    };

    const loadUser = async () => {
        const response = await fetch(`${apiUrl}/users/me`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setUser(undefined);
            return;
        }

        const json = await response.json();
        setUser(json);
    }

    const loadGroups = async () => {
        const response = await fetch(`${apiUrl}/groups/all`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setGroups(undefined);
            return;
        }

        const json = await response.json();
        setGroups(json);
    }

    const loadMyGroups = async () => {
        const response = await fetch(`${apiUrl}/groups/my`, fetchRequest).catch(() => {});
        
        if (response === undefined || !response.ok) {
            setMyGroups(undefined);
            return;
        }

        const json = await response.json();
        setMyGroups(json);
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

    useEffect(() => {

        if (!token) {
            return;
        }

        loadUser();
        loadGroups();
        loadMyGroups();
        loadQuizzes();

    }, []);
 
    return [
        { user: user, groups: groups, myGroups: myGroups, quizzes: quizzes },
        loadUser,
        loadGroups,
        loadMyGroups,
        loadQuizzes,
    ];
}


export { useProfileData };