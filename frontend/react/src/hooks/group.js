import { useState, useEffect } from "react";
import { getGroupHistory, getGroupMembers, getGroupToken } from "../api/group";
import { getAllQuizzes } from "../api/quiz";
import { getCurrentGame } from "../api/game";


const useGroupAdminData = (token, groupId) => {
    const [groupToken, setGroupToken] = useState(null);
    const [members, setMembers] = useState([]);
    const [results, setResults] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    const [quizzes, setQuizzes] = useState([]);

    const loadGroupMembers = async () => {
        const data = {
            authToken: token,
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

    const loadCurrentGame = async () => {
        const data = {
            authToken: token,
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
    
    useEffect(() => {
        const loadGroupToken = async () => {
            const data = {
                authToken: token,
                groupId,
            };
            const response = await getGroupToken(data);

            if (response === undefined || !response.ok) {
                setGroupToken(undefined);
                return;
            }

            const json = await response.json();
            setGroupToken(json);
        };

        const loadGroupResults = async () => {
            const data = {
                authToken: token,
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

        const loadQuizzes = async () => {
            const data = {
                authToken: token,
            };
            const response = await getAllQuizzes(data);
            
            if (response === undefined || !response.ok) {
                setQuizzes(undefined);
                return;
            }
    
            const json = await response.json();
            setQuizzes(json);
        };

        loadGroupToken();
        loadGroupMembers();
        loadGroupResults();
        loadQuizzes();
        loadCurrentGame();
    }, []);

    return {
        quizzes,
        groupToken,
        members,
        results,
        currentGame,
        loadGroupMembers,
        loadCurrentGame,
    };
};


const useGroupData = (token, groupId) => {
    const [members, setMembers] = useState([]);
    const [results, setResults] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    
    useEffect(() => {
        const loadGroupMembers = async () => {
            const data = {
                authToken: token,
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

        const loadGroupResults = async () => {
            const data = {
                authToken: token,
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

        const loadCurrentGame = async () => {
            const data = {
                authToken: token,
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

        loadGroupMembers();
        loadGroupResults();
        loadCurrentGame();
    }, []);

    return {
        members,
        results,
        currentGame,
    };
};


export {
    useGroupData,
    useGroupAdminData,
};