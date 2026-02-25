
export const API = (path) => `http://localhost:5000${path}`
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
