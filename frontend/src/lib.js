import { BASE_URL } from './services/api';

export const API = (path) => `${BASE_URL}${path}`
export async function api(path, method='GET', body, token) {
  const res = await fetch(API(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed')
  return res.json()
}
