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

/* ★ 全局缓存当前登录用户 */
let currentUser = null;
export function setCurrentUser(u) { currentUser = u; }
export function getCurrentUser() { return currentUser; }

export const authApi = {
    register: async (username, email, password) => {
        const r = await request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        setCurrentUser(r.user);
        return r;
    },

    login: async (identifier, password) => {
        const r = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password })
        });
        setCurrentUser(r.user);
        return r;
    },

    logout: async () => {
        const r = await request('/api/auth/logout', { method: 'POST' });
        setCurrentUser(null);
        return r;
    },

    me: async () => {
        try {
            const r = await request('/api/auth/me');
            setCurrentUser(r.user);
            return r;
        } catch (e) {
            setCurrentUser(null);
            throw e;
        }
    }
};