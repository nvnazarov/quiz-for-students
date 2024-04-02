import { apiUrl } from "./config";


const getCurrentGame = async ({ authToken, groupId }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/games/${groupId}`, requestParams).catch(() => undefined);
    return response;
};


const createGame = async ({ authToken, groupId, quizId }) => {
    const body = {
        quiz_id: quizId,
        group_id: groupId,
    };
    const requestParams = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            token: authToken,
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(`${apiUrl}/games/create`, requestParams).catch(() => undefined);
    return response;
};


export {
    getCurrentGame,
    createGame,
};