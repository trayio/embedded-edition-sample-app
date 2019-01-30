export const listSolutions = () =>
    fetch('/api/solutions', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const listSolutionInstances = () =>
    fetch('/api/solutionInstances', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const createSolutionInstance = (id, name) =>
    fetch('/api/solutionInstances', {
        body: JSON.stringify({
            id: id,
            name: name,
        }),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
    }).then(async res => ({
        ok: res.ok,
        body: await res.json(),
    }));

export const updateSolutionInstance = (solutionInstanceId, enabled) =>
    fetch(`/api/solutionInstance/${solutionInstanceId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            enabled: enabled,
        }),
    }).then(async res => ({
        ok: res.ok,
    }));

export const updateSolutionInstanceConfig = solutionInstanceId =>
    fetch(`/api/solutionInstance/${solutionInstanceId}/config`, {
        method: 'PATCH',
        credentials: 'include',
    }).then(async res => ({
        ok: res.ok,
        body: await res.json(),
    }));

export const getSolutionInstance = id =>
    fetch(`/api/solutionInstance/${id}`, {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const deleteSolutionInstance = id =>
    fetch(`/api/solutionInstance/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then(async res => ({
            ok: res.ok,
        }));
