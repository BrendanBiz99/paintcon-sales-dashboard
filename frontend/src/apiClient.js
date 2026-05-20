const BASE = import.meta.env.VITE_API_URL || '';

export const api = {
  get: (path) => fetch(`${BASE}/api${path}`).then((r) => r.json()),
};
