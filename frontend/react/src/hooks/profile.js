import { useState, useEffect } from "react";
import { getAllGroups, getAllOwnedGroups, getAllInvites } from "../api/group";
import { getAllQuizzes } from "../api/quiz";
import { getUser } from "../api/user";
 

const useProfileData = (token) => {
    const [user, setUser] = useState(
        {
            name: null,
            email: null,
        }
    );
    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [invites, setInvites] = useState([]);

    const loadUser = async () => {
        const data = {
            authToken: token,
        };
        const response = await getUser(data);
        
        if (response === undefined || !response.ok) {
            setUser(
                {
                    name: undefined,
                    email: undefined,
                }
            );
            return;
        }
        const json = await response.json();
        setUser(json);
    };

    const loadGroups = async () => {
        const data = {
            authToken: token,
        };
        const response = await getAllGroups(data);
        
        if (response === undefined || !response.ok) {
            setGroups(undefined);
            return;
        }

        const json = await response.json();
        setGroups(json);
    };

    const loadMyGroups = async () => {
        const data = {
            authToken: token,
        };
        const response = await getAllOwnedGroups(data);
        
        if (response === undefined || !response.ok) {
            setMyGroups(undefined);
            return;
        }

        const json = await response.json();
        setMyGroups(json);
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

    const loadInvites = async () => {
        const data = {
            authToken: token,
        };
        const response = await getAllInvites(data);
        
        if (response === undefined || !response.ok) {
            setInvites(undefined);
            return;
        }

        const json = await response.json();
        setInvites(json);
    };

    useEffect(() => {
        loadUser();
        loadGroups();
        loadMyGroups();
        loadQuizzes();
        loadInvites();
    }, []);
 
    return {
        user,
        invites,
        setUser,
        groups,
        myGroups,
        quizzes,
        loadUser,
        loadGroups,
        loadMyGroups,
        loadQuizzes,
        loadInvites,
    };
};


export {
    useProfileData,
};