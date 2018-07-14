export const listWorkflows = () =>
    fetch('/api/workflows', {credentials: 'include'})
        .then(async res => ({
            ok: res.ok,
            body: await res.json(),
        }));

export const useWorkflow = (id) =>
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
