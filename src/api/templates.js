export const listTemplates = () =>
    fetch('/api/templates', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }))
