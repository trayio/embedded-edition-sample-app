export const listWorkflows = () =>
    fetch('/api/workflows', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const getWorkflow = id =>
    fetch(`/api/workflows/${id}`, {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const useWorkflow = id =>
    fetch('/api/workflows', {
        body: JSON.stringify({
            id: id,
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

export const updateWorkflowConfig = id =>
    fetch(`/api/workflows/${id}/config`, {
        method: 'PATCH',
        credentials: 'include',
    }).then(async res => ({
        ok: res.ok,
        body: await res.json(),
    }));

export const updateWorkflowStatus = (id, enabled) =>
    fetch(`/api/workflows/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({ id, enabled }),
    }).then(res => ({ ok: res.ok }));

export const deleteWorkflow = id =>
    fetch(`/api/workflows/${id}`, {
        credentials: 'include',
        method: 'DELETE',
    });

export const getLogs = id =>
    fetch(`/api/workflows/${id}/logs`, {
        method: 'GET',
        credentials: 'include',
    }).then(async res => ({
        ok: res.ok,
        body: await res.json(),
    }));
