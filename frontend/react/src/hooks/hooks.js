import { getUser } from "../api/user";
import { getAllQuizzes } from "../api/quiz";
import { getAllGroups, getAllOwnedGroups, getAllInvites } from "../api/group";
import { useState, useEffect } from "react";


const useUser = (authToken) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const response = await getUser({ authToken });

            if (response !== undefined && response.ok) {
                const json = await response.json();
                setUser(json);
            } else {
                setUser(undefined);
            }
        };
        
        loadUser();
    }, [authToken]);

    return [user, setUser];
};


const useQuizzes = (authToken) => {
    const [quizzes, setQuizzes] = useState(null);

    useEffect(() => {
        const loadQuizzes = async () => {
            const response = await getAllQuizzes({ authToken });

            if (response !== undefined && response.ok) {
                const json = await response.json();
                setQuizzes(json);
            } else {
                setQuizzes(undefined);
            }
        };
        
        loadQuizzes();
    }, [authToken]);

    return [quizzes, setQuizzes];
};


const useGroups = (authToken) => {
    const [groups, setGroups] = useState(null);

    useEffect(() => {
        const loadGroups = async () => {
            const response = await getAllGroups({ authToken });

            if (response !== undefined && response.ok) {
                const json = await response.json();
                setGroups(json);
            } else {
                setGroups(undefined);
            }
        };
        
        loadGroups();
    }, [authToken]);

    return [groups, setGroups];
};


const useOwnedGroups = (authToken) => {
    const [groups, setGroups] = useState(null);

    useEffect(() => {
        const loadGroups = async () => {
            const response = await getAllOwnedGroups({ authToken });

            if (response !== undefined && response.ok) {
                const json = await response.json();
                setGroups(json);
            } else {
                setGroups(undefined);
            }
        };
        
        loadGroups();
    }, [authToken]);

    return [groups, setGroups];
};


const useInvites = (authToken) => {
    const [invites, setInvites] = useState(null);

    const loadInvites = async () => {
        const response = await getAllInvites({ authToken });

        if (response !== undefined && response.ok) {
            const json = await response.json();
            setInvites(json);
        } else {
            setInvites(undefined);
        }
    };

    useEffect(() => { loadInvites() }, [authToken]);

    return [invites, setInvites, loadInvites];
};


export {
    useUser,
    useQuizzes,
    useGroups,
    useOwnedGroups,
    useInvites,
};