export const me = () =>
    fetch('/api/me', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
            statusText: res.statusText,
        }))

export const listAuths = () =>
    fetch('/api/auths', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }))

export const getAuthEditUrl = (authId) =>
    fetch('/api/auth', {
        body: JSON.stringify({
            authId
        }),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        credentials: 'include'
    })
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }))

export const getAuthCreateUrl = (solutionInstanceId, externalAuthId) =>
    fetch('/api/auth/create', {
        body: JSON.stringify({
            solutionInstanceId,
            externalAuthId
        }),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        credentials: 'include'
    })
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }))
