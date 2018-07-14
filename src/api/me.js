export const me = () =>
    fetch('/api/me', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
            statusText: res.statusText,
        }))
