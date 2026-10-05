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

export const savesApi = {
    save: (pinId) =>
        request(`/api/pins/${pinId}/save`, { method: 'POST' }),

    unsave: (pinId) =>
        request(`/api/pins/${pinId}/save`, { method: 'DELETE' }),

    /* 我自己的 */
    listMySaves: () =>
        request('/api/me/saves'),

    /* 任意用户 */
    listUserSaves: (username) =>
        request(`/api/users/${encodeURIComponent(username)}/saves`)
};