import { getUser } from "../api/user";
import { getAllQuizzes } from "../api/quiz";
import { getAllGroups, getAllOwnedGroups, getAllInvites, getGroupMembers, getGroupHistory, getGroupToken } from "../api/group";
import { getCurrentGame } from "../api/game";
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


const useCurrentGame = (authToken, groupId) => {
    const [currentGame, setCurrentGame] = useState(null);

    const loadCurrentGame = async () => {
        const data = {
            authToken,
            groupId,
        };
        const response = await getCurrentGame(data);

        if (response === undefined || !response.ok) {
            setCurrentGame(undefined);
            return;
        }
        
        const json = await response.json();
        setCurrentGame(json);
    };

    useEffect(() => { loadCurrentGame() }, [authToken, groupId]);

    return [currentGame, setCurrentGame];
};


const useMembers = (authToken, groupId) => {
    const [members, setMembers] = useState(null);

    const loadMembers = async () => {
        const data = {
            authToken,
            groupId,
        };
        const response = await getGroupMembers(data);

        if (response === undefined || !response.ok) {
            setMembers(undefined);
            return;
        }

        const json = await response.json();
        setMembers(json);
    };

    useEffect(() => { loadMembers() }, [authToken, groupId]);

    return [members, setMembers];
};


const useResults = (authToken, groupId) => {
    const [results, setResults] = useState(null);

    const loadResults = async () => {
        const data = {
            authToken,
            groupId,
        };
        const response = await getGroupHistory(data);

        if (response === undefined || !response.ok) {
            setResults(undefined);
            return;
        }

        const json = await response.json();
        setResults(json);
    };

    useEffect(() => { loadResults() }, [authToken, groupId]);

    return [results, setResults];
};


const useGroupToken = (authToken, groupId) => {
    const [token, setToken] = useState(null);

    const loadToken = async () => {
        const data = {
            authToken,
            groupId,
        };
        const response = await getGroupToken(data);

        if (response === undefined || !response.ok) {
            setToken(undefined);
            return;
        }

        const json = await response.json();
        setToken(json);
    };

    useEffect(() => { loadToken() }, [authToken, groupId]);

    return [token, setToken];
};


export {
    useUser,
    useQuizzes,
    useGroups,
    useOwnedGroups,
    useInvites,
    useCurrentGame,
    useMembers,
    useResults,
    useGroupToken,
};