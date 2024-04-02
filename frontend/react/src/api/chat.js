import { apiUrl } from "./config";


const getAllMessages = async ({ authToken, groupId }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/chat/${groupId}/all`, requestParams).catch(() => undefined);
    return response;
};


export {
    getAllMessages,
};