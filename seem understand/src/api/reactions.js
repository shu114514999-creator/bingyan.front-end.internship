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

export const reactionsApi = {
    react: (pinId) => request(`/api/pins/${pinId}/react`, { method: 'POST' }),
    unreact: (pinId) => request(`/api/pins/${pinId}/react`, { method: 'DELETE' }),
    get: (pinId) => request(`/api/pins/${pinId}/reactions`)
};