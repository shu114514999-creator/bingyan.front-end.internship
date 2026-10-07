async function jsonRequest(path, options = {}) {
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

export const pinsApi = {
    create: async (formData) => {
        const res = await fetch('/api/pins', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const err = new Error(data.error || `上传失败 (${res.status})`);
            err.status = res.status;
            throw err;
        }
        return data;
    },

    /* ★ 所有上传的 pin */
    listAll: () => jsonRequest('/api/pins'),

    listUser: (username) =>
        jsonRequest(`/api/users/${encodeURIComponent(username)}/pins`)
};