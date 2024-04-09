import { apiUrl } from "./config";


const createQuiz = () => {

};


const createTest = async ({ authToken, name, data }) => {
    const body = {
        name: name,
        data: data,
    };
    const requestParams = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            token: authToken,
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(`${apiUrl}/quizzes/create/test`, requestParams).catch(() => undefined);
    return response;
};


const updateQuiz = () => {

};


const updateTest = async ({ authToken, id, data }) => {
    const body = {
        id: id,
        data: data,
    };
    const requestParams = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            token: authToken,
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(`${apiUrl}/quizzes/update/test`, requestParams).catch(() => undefined);
    return response;
};


const getAllQuizzes = async ({ authToken }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/quizzes/my`, requestParams).catch(() => undefined);
    return response;
};


const getQuizData = async ({ authToken, id }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/quizzes/${id}`, requestParams).catch(() => undefined);
    return response;
};


export {
    createTest,
    createQuiz,
    updateTest,
    updateQuiz,
    getAllQuizzes,
    getQuizData,
};