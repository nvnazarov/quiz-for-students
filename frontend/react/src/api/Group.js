import { apiUrl } from "./config";


const createGroup = async ({ authToken, name }) => {
    const requestParams = {
        method: "POST",
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/create/${name}`, requestParams).catch(() => undefined);
    return response;
};


const getAllGroups = async ({ authToken }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/all`, requestParams).catch(() => undefined);
    return response;
};


const getAllOwnedGroups = async ({ authToken }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/my`, requestParams).catch(() => undefined);
    return response;
};


const getGroupMembers = async ({ authToken, groupId }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/${groupId}/members`, requestParams).catch(() => undefined);
    return response;
};


const getGroupInfo = async ({ authToken, groupId }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/${groupId}`, requestParams).catch(() => undefined);
    return response;
};


const getGroupHistory = async ({ authToken, groupId }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/${groupId}/history`, requestParams).catch(() => undefined);
    return response;
};


const getGroupToken = async ({ authToken, groupId }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/${groupId}/token`, requestParams).catch(() => undefined);
    return response;
};


const joinGroup = async ({ authToken, groupToken }) => {
    const requestParams = {
        method: "POST",
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/join/${groupToken}`, requestParams).catch(() => undefined);
    return response;
};


const banGroupMember = async ({ authToken, groupId, memberId }) => {
    const requestParams = {
        method: "POST",
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/${groupId}/ban/${memberId}`, requestParams).catch(() => undefined);
    return response;
};


const unbanGroupMember = async ({ authToken, groupId, memberId }) => {
    const requestParams = {
        method: "POST",
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/${groupId}/unban/${memberId}`, requestParams).catch(() => undefined);
    return response;
};


const joinByInvite = async ({ authToken, inviteId }) => {
    const requestParams = {
        method: "POST",
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/join/invite/${inviteId}`, requestParams).catch(() => undefined);
    return response;
};


const inviteUser = async ({ authToken, groupId, email }) => {
    const requestParams = {
        method: "POST",
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/${groupId}/invite/${email}`, requestParams).catch(() => undefined);
    return response;
};


const getAllInvites = async ({ authToken }) => {
    const requestParams = {
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/invites`, requestParams).catch(() => undefined);
    return response;
};


const cancelInvite = async ({ authToken, inviteId }) => {
    const requestParams = {
        method: "POST",
        headers: {
            token: authToken,
        },
    };
    const response = await fetch(`${apiUrl}/groups/invites/cancel/${inviteId}`, requestParams).catch(() => undefined);
    return response;
};


export {
    createGroup,
    getAllGroups,
    getAllOwnedGroups,
    getGroupMembers,
    getGroupToken,
    banGroupMember,
    unbanGroupMember,
    getGroupInfo,
    getGroupHistory,
    joinGroup,
    joinByInvite,
    inviteUser,
    getAllInvites,
    cancelInvite,
};