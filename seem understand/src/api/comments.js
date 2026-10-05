async function request(path, options = {}) {
    const res = await fetch(path, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.error || `请求失败 (${res.status})`);
        err.status = res.status;
        throw err;
    }
    return data;
}

export const commentsApi = {
    list: (pinId) =>
        request(`/api/pins/${pinId}/comments`),

    create: (pinId, text) =>
        request(`/api/pins/${pinId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ text })
        }),

    remove: (commentId) =>
        request(`/api/comments/${commentId}`, { method: 'DELETE' })
};